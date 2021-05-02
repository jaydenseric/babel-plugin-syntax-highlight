'use strict'

const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')

// Load every available Prism.js language.
loadLanguages()

module.exports = function babelPluginSyntaxHighlight({ types }) {
  return {
    name: 'syntax-highlight',
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

        // Find the leading comments. Sometimes Babel associates them with an
        // ancestor, instead of the template literal.
        const leadingComments = path.node.leadingComments
          ? path.node.leadingComments
          : path.parent.type === 'ExpressionStatement'
          ? path.parent.leadingComments
          : null

        // Skip this template literal if there are no leading comments.
        if (!leadingComments) return

        const languageSpecifierComments = []

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
          )

          if (match) {
            if (!match[1])
              throw state.buildCodeFrameError(
                comment,
                'Missing the Prism.js language name.'
              )

            languageSpecifierComments.push({
              leadingCommentIndex,
              comment,
              languageName: match[1],
            })
          }
        })

        if (languageSpecifierComments.length) {
          if (languageSpecifierComments.length > 1)
            throw state.buildCodeFrameError(
              languageSpecifierComments[1].comment,
              'Multiple Prism.js language names specified.'
            )

          const prismLanguage =
            Prism.languages[languageSpecifierComments[0].languageName]

          if (!prismLanguage)
            throw state.buildCodeFrameError(
              languageSpecifierComments[0].comment,
              `\`${languageSpecifierComments[0].languageName}\` isn’t an available Prism.js language name.`
            )

          if (path.node.expressions.length)
            throw state.buildCodeFrameError(
              path.node.expressions[0],
              'Template literal expressions aren’t supported.'
            )

          // Create the syntax highlighted code string.
          const highlightedCode = Prism.highlight(
            // Get the code string from the template literal.
            path.node.quasis[0].value.cooked,
            prismLanguage
          )

          // Remove the language specifier comment. This has to happen before
          // replacing the template literal, or else the triggered revisit will
          // find the comment again and start a crazy feedback loop.
          leadingComments.splice(
            languageSpecifierComments[0].leadingCommentIndex,
            1
          )

          // Replace the template literal with the syntax highlighted version.
          path.replaceWith(
            types.templateLiteral(
              [
                types.templateElement(
                  {
                    raw: highlightedCode
                      // Add a backslash before every ‘`’, ‘\’ and ‘${’.
                      // See: https://github.com/babel/babel/issues/9242#issuecomment-532529613
                      .replace(/\\|`|\$\{/gu, '\\$&'),
                    cooked: highlightedCode,
                  },
                  true
                ),
              ],
              []
            )
          )
        }
      },
    },
  }
}
