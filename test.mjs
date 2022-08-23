import babel from "@babel/core";
import { rejects, strictEqual } from "assert";
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

tests.add("Line comment expression statement.", async () => {
  const result = await babel.transformAsync(
    "// syntax-highlight graphql\n`scalar Upload`",
    {
      plugins: [babelPluginSyntaxHighlight],
    }
  );

  strictEqual(
    result?.code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Block comment expression statement.", async () => {
  const result = await babel.transformAsync(
    "/* syntax-highlight graphql */ `scalar Upload`",
    {
      plugins: [babelPluginSyntaxHighlight],
    }
  );

  strictEqual(
    result?.code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Variable declarator.", async () => {
  const result = await babel.transformAsync(
    "const a = /* syntax-highlight graphql */ `scalar Upload`",
    { plugins: [babelPluginSyntaxHighlight] }
  );

  strictEqual(
    result?.code,
    'const a = `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Arrow function expression.", async () => {
  const result = await babel.transformAsync(
    "const a = () => /* syntax-highlight graphql */ `scalar Upload`",
    { plugins: [babelPluginSyntaxHighlight] }
  );

  strictEqual(
    result?.code,
    'const a = () => `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Object property.", async () => {
  const result = await babel.transformAsync(
    "const a = { b: /* syntax-highlight graphql */ `scalar Upload` }",
    { plugins: [babelPluginSyntaxHighlight] }
  );

  strictEqual(
    result?.code,
    'const a = {\n  b: `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`\n};'
  );
});

tests.add("Template literal escapes.", async () => {
  const result = await babel.transformAsync(
    // Use markup for simple output. Backslash escaping of ‘`’, ‘\’ and ‘${’
    // (only if ‘$’ is followed by ‘{’) is being tested.
    "/* syntax-highlight markup */ `\\`\\${ $ \\\\ \\` \\``",
    { plugins: [babelPluginSyntaxHighlight] }
  );

  strictEqual(result?.code, "`\\`\\${ $ \\\\ \\` \\``;");
});

tests.add("Unrelated expression statement template literal.", async () => {
  const result = await babel.transformAsync("``", {
    plugins: [babelPluginSyntaxHighlight],
  });

  strictEqual(result?.code, "``;");
});

tests.add("Unrelated variable declaration template literal.", async () => {
  const result = await babel.transformAsync("const a = ``", {
    plugins: [babelPluginSyntaxHighlight],
  });

  strictEqual(result?.code, "const a = ``;");
});

tests.add("Unrelated comment and template literal.", async () => {
  const result = await babel.transformAsync("/* GraphQL */ ``", {
    plugins: [babelPluginSyntaxHighlight],
  });

  strictEqual(result?.code, "/* GraphQL */\n``;");
});

tests.add("Multiple relevant and irrelevant comments.", async () => {
  const result = await babel.transformAsync(
    "/* syntax-highlight graphql */ /* GraphQL */ `scalar Upload`",
    { plugins: [babelPluginSyntaxHighlight] }
  );

  strictEqual(
    result?.code,
    '/* GraphQL */\n`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  );
});

tests.add("Multiple relevant comments.", async () => {
  await rejects(
    babel.transformAsync(
      "/* syntax-highlight css */ /* syntax-highlight graphql */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    ),
    annotatedBabelSyntaxErrorValidator(
      /Multiple Prism\.js language names specified\./u
    )
  );
});

tests.add("Comment missing the language name.", async () => {
  await rejects(
    babel.transformAsync("/* syntax-highlight */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    }),
    annotatedBabelSyntaxErrorValidator(/Missing the Prism\.js language name\./u)
  );
});

tests.add("Unavailable Prism.js language name.", async () => {
  await rejects(
    babel.transformAsync("/* syntax-highlight _ */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    }),
    annotatedBabelSyntaxErrorValidator(
      /`_` isn’t an available Prism\.js language name\./u
    )
  );
});

tests.add("Unsupported template literal expression.", async () => {
  await rejects(
    babel.transformAsync('/* syntax-highlight graphql */ `${""}`', {
      plugins: [babelPluginSyntaxHighlight],
    }),
    annotatedBabelSyntaxErrorValidator(
      /Template literal expressions aren’t supported\./u
    )
  );
});

tests.add("Comment not leading a template literal.", async () => {
  const result = await babel.transformAsync("/* syntax-highlight graphql */", {
    plugins: [babelPluginSyntaxHighlight],
  });

  strictEqual(result?.code, "/* syntax-highlight graphql */");
});

tests.run();
