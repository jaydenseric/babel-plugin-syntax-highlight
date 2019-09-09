# babel-plugin-syntax-highlight

[![npm version](https://badgen.net/npm/v/babel-plugin-syntax-highlight)](https://npm.im/babel-plugin-syntax-highlight) [![CI status](https://github.com/jaydenseric/babel-plugin-syntax-highlight/workflows/CI/badge.svg)](https://github.com/jaydenseric/babel-plugin-syntax-highlight/actions)

A [Babel](https://babeljs.io) plugin that transforms specific tagged code template strings into [Prism.js](https://prismjs.com) syntax highlighted HTML strings.

Build-time syntax highlighting advantages:

- 🚀 No runtime JS to slow page loads.
- 🖌 Less client rendering work.
- 🎨 Beautiful code the instant the HTML and CSS loads.

As a bonus, modern editors can syntax highlight and Prettier format the tagged code template strings.

## Support

- Node.js v10+

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install babel-plugin-syntax-highlight --save-dev
```

Configure Babel using plugin defaults:

```json
{
  "plugins": ["syntax-highlight"]
}
```

Or, to customize the code template string tag import module specifier:

```json
{
  "plugins": [
    ["syntax-highlight", { "moduleSpecifier": "babel-plugin-syntax-highlight" }]
  ]
}
```

## Usage

In a file transpiled by Babel, import [supported Prism.js languages](https://prismjs.com/#supported-languages) to tag code template strings:

```js
import { css } from 'babel-plugin-syntax-highlight'

const highlighted = css`
  div {
    color: red;
  }
`
```

The plugin removes the import and transforms the tagged template strings into HTML strings:

```js
const highlighted =
  '<span class="token selector">div</span> <span class="token punctuation">{</span> <span class="token property">color</span><span class="token punctuation">:</span> red <span class="token punctuation">}</span>'
```

Styling the syntax highlighting HTML is up to you; there are many theme stylesheets available. Often themes require `<pre>` and `<code>` containers with appropriate language classes.

### React

```jsx
const SyntaxHighlightedCode = ({ language, code }) => (
  <pre className={`language-${language}`}>
    <code
      className={`language-${language}`}
      dangerouslySetInnerHTML={{ __html: code }}
    />
  </pre>
)

<SyntaxHighlightedCode language="css" code={highlighted} />
```

## Todo

- Support CJS `require`.
- For performance it might be better to load Prism.js languages on demand.
