import { strictEqual, throws } from "assert";
import babel from "@babel/core";
import TestDirector from "test-director";
import babelPluginSyntaxHighlight from "./index.js";

const tests = new TestDirector();

/**
 * Creates a function that validates an error is a Babel syntax error with a
 * particular message that contains an annotated source location.
 * @param {RegExp} messageRegex RegEx to check the error message against.
 * @returns {Function} Error validator.
 */
const annotatedBabelSyntaxErrorValidator = (messageRegex) => (error) =>
  // Error is a Babel syntax error.
  error.name === "SyntaxError" &&
  // Error has a particular message.
  messageRegex.test(error.message) &&
  // Error message has an annotated source location.
  />.+\d+.+\|.+\^/su.test(error.message);

tests.add("Line comment expression statement.", () => {
  strictEqual(
    babel.transform("// syntax-highlight graphql\n`scalar Upload`", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Block comment expression statement.", () => {
  strictEqual(
    babel.transform("/* syntax-highlight graphql */ `scalar Upload`", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Variable declarator.", () => {
  strictEqual(
    babel.transform(
      "const a = /* syntax-highlight graphql */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Arrow function expression.", () => {
  strictEqual(
    babel.transform(
      "const a = () => /* syntax-highlight graphql */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = () => `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Object property.", () => {
  strictEqual(
    babel.transform(
      "const a = { b: /* syntax-highlight graphql */ `scalar Upload` }",
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = {\n  b: `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`\n};'
  );
});

tests.add("Template literal escapes.", () => {
  strictEqual(
    babel.transform(
      // Use markup for simple output. Backslash escaping of ‘`’, ‘\’ and ‘${’
      // (only if ‘$’ is followed by ‘{’) is being tested.
      "/* syntax-highlight markup */ `\\`\\${ $ \\\\ \\` \\``",
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    "`\\`\\${ $ \\\\ \\` \\``;"
  );
});

tests.add("Unrelated expression statement template literal.", () => {
  strictEqual(
    babel.transform("``", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    "``;"
  );
});

tests.add("Unrelated variable declaration template literal.", () => {
  strictEqual(
    babel.transform("const a = ``", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    "const a = ``;"
  );
});

tests.add("Unrelated comment and template literal.", () => {
  strictEqual(
    babel.transform("/* GraphQL */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    "/* GraphQL */\n``;"
  );
});

tests.add("Multiple relevant and irrelevant comments.", () => {
  strictEqual(
    babel.transform(
      "/* syntax-highlight graphql */ /* GraphQL */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    '/* GraphQL */\n`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Multiple relevant comments.", () => {
  throws(() => {
    babel.transform(
      "/* syntax-highlight css */ /* syntax-highlight graphql */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    );
  }, annotatedBabelSyntaxErrorValidator(/Multiple Prism\.js language names specified\./u));
});

tests.add("Comment missing the language name.", () => {
  throws(() => {
    babel.transform("/* syntax-highlight */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    });
  }, annotatedBabelSyntaxErrorValidator(/Missing the Prism\.js language name\./u));
});

tests.add("Unavailable Prism.js language name.", () => {
  throws(() => {
    babel.transform("/* syntax-highlight _ */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    });
  }, annotatedBabelSyntaxErrorValidator(/`_` isn’t an available Prism\.js language name\./u));
});

tests.add("Unsupported template literal expression.", () => {
  throws(() => {
    babel.transform('/* syntax-highlight graphql */ `${""}`', {
      plugins: [babelPluginSyntaxHighlight],
    });
  }, annotatedBabelSyntaxErrorValidator(/Template literal expressions aren’t supported\./u));
});

tests.add("Comment not leading a template literal.", () => {
  strictEqual(
    babel.transform("/* syntax-highlight graphql */", {
      plugins: [babelPluginSyntaxHighlight],
    }).code,
    "/* syntax-highlight graphql */"
  );
});

tests.run();
