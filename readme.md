# babel-plugin-syntax-highlight

[![npm version](https://badgen.net/npm/v/babel-plugin-syntax-highlight)](https://npm.im/babel-plugin-syntax-highlight) [![CI status](https://github.com/jaydenseric/babel-plugin-syntax-highlight/workflows/CI/badge.svg)](https://github.com/jaydenseric/babel-plugin-syntax-highlight/actions)

A [Babel](https://babeljs.io) plugin that transforms the code contents of template literals lead by comments specifying a [Prism.js](https://prismjs.com) language into syntax highlighted HTML.

Build-time syntax highlighting advantages:

- 🚀 No runtime JS to slow page loads.
- 🖌 Less client rendering work.
- 🎨 Beautiful code the instant the HTML and CSS loads.

## Support

- Node.js v10+

## Setup

To install from [npm](https://npmjs.com) run:

```sh
npm install babel-plugin-syntax-highlight --save-dev
```

Configure Babel to use the plugin:

```json
{ "plugins": ["syntax-highlight"] }
```

## Usage

In a file transpiled by Babel, lead a template literal containing syntax to highlight with a comment containing `syntax-highlight` and a [Prism.js language name](https://prismjs.com/#supported-languages):

```js
const highlighted = /* syntax-highlight graphql */ `
  scalar Upload
`
```

The comment may be surrounded by others on the same or other lines for editor syntax highlighting, [Prettier](https://prettier.io) formatting, etc.

```js
const highlighted =
  /* syntax-highlight graphql */
  /* GraphQL */ `
    scalar Upload
  `
```

A block or line comment may be used:

```js
const highlighted =
  // syntax-highlight graphql
  `scalar Upload`
```

The plugin removes the comment (preserving surrounding comments) and transforms the template literal contents into HTML:

```js
const highlighted = `<span class="token keyword">scalar</span> <span class="token class-name">Upload</span>`
```

Styling the HTML is up to you; there are many theme stylesheets available. Often themes require `<pre>` and `<code>` containers with appropriate language classes.

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
