import babel from "@babel/core";
import { ok, strictEqual } from "assert";
import assertSnapshot from "snapshot-assertion";
import TestDirector from "test-director";

import babelPluginSyntaxHighlight from "./index.js";

const tests = new TestDirector();

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
  let error;

  try {
    await babel.transformAsync(
      "/* syntax-highlight css */ /* syntax-highlight graphql */ `scalar Upload`",
      { plugins: [babelPluginSyntaxHighlight] }
    );
  } catch (e) {
    error = e;
  }

  ok(error instanceof Error);

  await assertSnapshot(
    error.message,
    new URL(
      "./test/snapshots/multiple-relevant-comments-error.ans",
      import.meta.url
    )
  );
});

tests.add("Comment missing the language name.", async () => {
  let error;

  try {
    await babel.transformAsync("/* syntax-highlight */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    });
  } catch (e) {
    error = e;
  }

  ok(error instanceof Error);

  await assertSnapshot(
    error.message,
    new URL(
      "./test/snapshots/comment-missing-the-language-name-error.ans",
      import.meta.url
    )
  );
});

tests.add("Unavailable Prism.js language name.", async () => {
  let error;

  try {
    await babel.transformAsync("/* syntax-highlight _ */ ``", {
      plugins: [babelPluginSyntaxHighlight],
    });
  } catch (e) {
    error = e;
  }

  ok(error instanceof Error);

  await assertSnapshot(
    error.message,
    new URL(
      "./test/snapshots/unavailable-prismjs-language-name-error.ans",
      import.meta.url
    )
  );
});

tests.add("Unsupported template literal expression.", async () => {
  let error;

  try {
    await babel.transformAsync('/* syntax-highlight graphql */ `${""}`', {
      plugins: [babelPluginSyntaxHighlight],
    });
  } catch (e) {
    error = e;
  }

  ok(error instanceof Error);

  await assertSnapshot(
    error.message,
    new URL(
      "./test/snapshots/unsupported-template-literal-expression-error.ans",
      import.meta.url
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
