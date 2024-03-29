// @ts-check

"use strict";

const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/index.js");

// Load every available Prism.js language.
loadLanguages();

/**
 * A [Babel](https://babeljs.io) plugin that transforms the code contents of
 * template literals lead by comments specifying a
 * [Prism.js](https://prismjs.com) language into syntax highlighted HTML.
 * @param {import("@babel/core") & import("@babel/core").ConfigAPI} babelApi
 *   Babel API.
 * @returns {import("@babel/core").PluginObj} Babel plugin.
 */
function babelPluginSyntaxHighlight({ types }) {
  return {
    name: "syntax-highlight",
    visitor: {
      TemplateLiteral(
        path,

        // Destructuring the state would break the context for it’s instance
        // methods.
        state
      ) {
        // The language specifier comment is the first match before the template
        // literal, allowing coexistence with other leading comments like
        // /* GraphQL */ for editor syntax highlighting and Prettier formatting.
        // The user may mistakenly use multiple language specifier comments; all
        // must be gathered to be able to alert the user of their mistake.

        /**
         * The leading comments. Sometimes Babel associates them with an
         * ancestor, instead of the template literal.
         */
        const leadingComments = path.node.leadingComments
          ? path.node.leadingComments
          : path.parent.type === "ExpressionStatement"
          ? path.parent.leadingComments
          : null;

        // Skip this template literal if there are no leading comments.
        if (!leadingComments) return;

        /**
         * @type {Array<{
         *   leadingCommentIndex: number,
         *   comment: import("@babel/core").types.Comment,
         *   languageName: string
         * }>}
         */
        const languageSpecifierComments = [];

        leadingComments.forEach((comment, leadingCommentIndex) => {
          // A matching comment begins with optional whitespace (including
          // newlines), followed by “syntax-highlight”, then whitespace
          // (including newlines), then any non-whitespace characters are
          // captured as the Prism.js language name, then optional whitespace
          // characters until the end. Examples:
          // 1. /* syntax-highlight css */
          // 2. // syntax-highlight css
          const match = /^\s*syntax-highlight(?:\s+([^\s]+))?\s*$/mu.exec(
            // A comment value excludes the actual comment syntax.
            comment.value
          );

          if (match) {
            if (!match[1])
              // @ts-ignore Incorrect types.
              throw state.buildCodeFrameError(
                comment,
                "Missing the Prism.js language name."
              );

            languageSpecifierComments.push({
              leadingCommentIndex,
              comment,
              languageName: match[1],
            });
          }
        });

        if (languageSpecifierComments.length) {
          if (languageSpecifierComments.length > 1)
            // @ts-ignore Incorrect types.
            throw state.buildCodeFrameError(
              languageSpecifierComments[1].comment,
              "Multiple Prism.js language names specified."
            );

          const { languageName } = languageSpecifierComments[0];

          if (
            !(languageName in Prism.languages) ||
            // Guard against the edge case where the specified language name is
            // the name of one of the `Prism.languages` methods, e.g. `extend`.
            typeof Prism.languages[
              /** @type {keyof typeof Prism.languages} */ (languageName)
            ] !== "object"
          )
            // @ts-ignore Incorrect types.
            throw state.buildCodeFrameError(
              languageSpecifierComments[0].comment,
              `\`${languageName}\` isn’t an available Prism.js language name.`
            );

          const prismGrammar = /** @type {import("prismjs").Grammar} */ (
            Prism.languages[
              /** @type {keyof typeof Prism.languages} */ (languageName)
            ]
          );

          if (path.node.expressions.length)
            // @ts-ignore Incorrect types.
            throw state.buildCodeFrameError(
              path.node.expressions[0],
              "Template literal expressions aren’t supported."
            );

          /** The code string from the template literal. */
          const text = path.node.quasis[0].value.cooked;

          if (typeof text !== "string")
            // Babel can’t provide the cooked string, possibly due to an invalid
            // escape sequence in the raw string. Normally that results in a
            // Babel parser error, but that won’t happen if the Babel transform
            // option `parserOpts.errorRecovery` is enabled.
            // @ts-ignore Incorrect types.
            throw state.buildCodeFrameError(
              path.node.quasis[0],
              "Template literal string can’t be cooked."
            );

          /** The syntax highlighted code string. */
          const highlightedCode = Prism.highlight(
            text,
            prismGrammar,
            languageName
          );

          // Remove the language specifier comment. This has to happen before
          // replacing the template literal, or else the triggered revisit will
          // find the comment again and start a crazy feedback loop.
          leadingComments.splice(
            languageSpecifierComments[0].leadingCommentIndex,
            1
          );

          // Replace the template literal with the syntax highlighted version.
          path.replaceWith(
            types.templateLiteral(
              [
                types.templateElement(
                  {
                    raw: highlightedCode
                      // Add a backslash before every ‘`’, ‘\’ and ‘${’.
                      // See: https://github.com/babel/babel/issues/9242#issuecomment-532529613
                      .replace(/\\|`|\$\{/gu, "\\$&"),
                    cooked: highlightedCode,
                  },
                  true
                ),
              ],
              []
            )
          );
        }
      },
    },
  };
}

module.exports = babelPluginSyntaxHighlight;
