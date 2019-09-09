const assert = require('assert').strict
const babel = require('@babel/core')
const package = require('./package.json')
const { TestManager } = require('./TestManager')
const babelPluginSyntaxHighlight = require('.')

const testManager = new TestManager()

testManager.addTest('Unexpected default import.', () => {
  assert.throws(
    () => {
      babel.transform(`import _ from '${package.name}'`, {
        plugins: [babelPluginSyntaxHighlight]
      })
    },
    {
      name: 'SyntaxError',
      message: /Unexpected default import\./
    }
  )
})

testManager.addTest('Missing named imports.', () => {
  assert.throws(
    () => {
      babel.transform(`import '${package.name}'`, {
        plugins: [babelPluginSyntaxHighlight]
      })
    },
    {
      name: 'SyntaxError',
      message: /Missing named imports\./
    }
  )
})

testManager.addTest('Unavailable Prism.js language.', () => {
  assert.throws(
    () => {
      babel.transform(`import { _ } from '${package.name}'`, {
        plugins: [babelPluginSyntaxHighlight]
      })
    },
    {
      name: 'SyntaxError',
      message: /`_` isn’t an available Prism\.js language\./
    }
  )
})

testManager.addTest('Not tagging a template string.', () => {
  assert.throws(
    () => {
      babel.transform(
        `import { css } from '${package.name}'
css`,
        { plugins: [babelPluginSyntaxHighlight] }
      )
    },
    {
      name: 'SyntaxError',
      message: /Not tagging a template string of code to syntax highlight\./
    }
  )
})

testManager.addTest('Unsupported template string placeholders.', () => {
  assert.throws(
    () => {
      babel.transform(
        `import { css } from '${package.name}'
css\`\${''}\``,
        { plugins: [babelPluginSyntaxHighlight] }
      )
    },
    {
      name: 'SyntaxError',
      message: /Template string placeholders aren’t supported\./
    }
  )
})

testManager.addTest('Correct usage.', () => {
  assert.strictEqual(
    babel.transform(
      `import { css } from '${package.name}'
css\`div {}\``,
      { plugins: [babelPluginSyntaxHighlight] }
    ).code,
    '"<span class=\\"token selector\\">div</span> <span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">}</span>";'
  )
})

testManager.addTest('Custom module specifier.', () => {
  const moduleSpecifier = '_'

  assert.strictEqual(
    babel.transform(
      `import { css } from '${moduleSpecifier}'
css\`div {}\``,
      { plugins: [[babelPluginSyntaxHighlight, { moduleSpecifier }]] }
    ).code,
    '"<span class=\\"token selector\\">div</span> <span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">}</span>";'
  )
})

testManager.addTest(
  'Unrelated imports and tagged template strings are untouched.',
  () => {
    assert.strictEqual(
      babel.transform(
        `import gql from 'graphql-tag'
gql\`\``,
        {
          plugins: [babelPluginSyntaxHighlight]
        }
      ).code,
      `import gql from 'graphql-tag';
gql\`\`;`
    )
  }
)

testManager.runTests()
