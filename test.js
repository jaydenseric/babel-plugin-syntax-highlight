const assert = require('assert').strict
const babel = require('@babel/core')
const { TestManager } = require('./TestManager')
const babelPluginSyntaxHighlight = require('.')

const testManager = new TestManager()

/**
 * Creates an function that validates an error is a particular Babel syntax
 * error, annotated with a source location colored with control characters.
 * @param {RegExp} messageRegex RegEx to check the error message against.
 * @returns {Function} Error validator.
 */
const annotatedBabelSyntaxErrorValidator = messageRegex => error =>
  error.name === 'SyntaxError' &&
  messageRegex.test(error) &&
  // Error has pretty source location info, indicated by a red greater than
  // symbol followed by a space, then a line number, then a space, then a pipe
  // character.
  // eslint-disable-next-line no-control-regex
  /^\[0m\[31m\[1m>\[22m\[39m\[90m \d+ \| /m.test(error.message)

testManager.addTest('Line comment expression statement.', () => {
  assert.strictEqual(
    babel.transform('// syntax-highlight graphql\n`scalar Upload`', {
      plugins: [babelPluginSyntaxHighlight]
    }).code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  )
})

testManager.addTest('Block comment expression statement.', () => {
  assert.strictEqual(
    babel.transform('/* syntax-highlight graphql */ `scalar Upload`', {
      plugins: [babelPluginSyntaxHighlight]
    }).code,
    '`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  )
})

testManager.addTest('Variable declarator.', () => {
  assert.strictEqual(
    babel.transform(
      'const a = /* syntax-highlight graphql */ `scalar Upload`',
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  )
})

testManager.addTest('Arrow function expression.', () => {
  assert.strictEqual(
    babel.transform(
      'const a = () => /* syntax-highlight graphql */ `scalar Upload`',
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = () => `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  )
})

testManager.addTest('Object property.', () => {
  assert.strictEqual(
    babel.transform(
      'const a = { b: /* syntax-highlight graphql */ `scalar Upload` }',
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    'const a = {\n  b: `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`\n};'
  )
})

testManager.addTest('Template literal escapes.', () => {
  assert.strictEqual(
    babel.transform('/* syntax-highlight js */ `\\` \\\\ \\` \\``', {
      plugins: [babelPluginSyntaxHighlight]
    }).code,
    '`<span class="token template-string"><span class="token template-punctuation string">\\`</span><span class="token string"> \\\\ </span><span class="token template-punctuation string">\\`</span></span> \\``;'
  )
})

testManager.addTest('Unrelated comment and template literal.', () => {
  assert.strictEqual(
    babel.transform('/* GraphQL */ ``', {
      plugins: [babelPluginSyntaxHighlight]
    }).code,
    '/* GraphQL */\n``;'
  )
})

testManager.addTest('Multiple relevant and irrelevant comments.', () => {
  assert.strictEqual(
    babel.transform(
      '/* syntax-highlight graphql */ /* GraphQL */ `scalar Upload`',
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    '/* GraphQL */\n`<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`;'
  )
})

testManager.addTest('Multiple relevant comments.', () => {
  assert.throws(() => {
    babel.transform(
      '/* syntax-highlight css */ /* syntax-highlight graphql */ `scalar Upload`',
      { plugins: [babelPluginSyntaxHighlight] }
    )
  }, annotatedBabelSyntaxErrorValidator(/Multiple Prism\.js language names specified\./))
})

testManager.addTest('Comment missing the language name.', () => {
  assert.throws(() => {
    babel.transform('/* syntax-highlight */ ``', {
      plugins: [babelPluginSyntaxHighlight]
    })
  }, annotatedBabelSyntaxErrorValidator(/Missing the Prism\.js language name\./))
})

testManager.addTest('Unavailable Prism.js language name.', () => {
  assert.throws(() => {
    babel.transform('/* syntax-highlight _ */ ``', {
      plugins: [babelPluginSyntaxHighlight]
    })
  }, annotatedBabelSyntaxErrorValidator(/`_` isn’t an available Prism\.js language name\./))
})

testManager.addTest('Unsupported template literal expression.', () => {
  assert.throws(() => {
    babel.transform("/* syntax-highlight graphql */ `${''}`", {
      plugins: [babelPluginSyntaxHighlight]
    })
  }, annotatedBabelSyntaxErrorValidator(/Template literal expressions aren’t supported\./))
})

testManager.addTest('Comment not leading a template literal.', () => {
  assert.strictEqual(
    babel.transform('/* syntax-highlight graphql */', {
      plugins: [babelPluginSyntaxHighlight]
    }).code,
    '/* syntax-highlight graphql */'
  )
})

testManager.runTests()
