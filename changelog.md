# babel-plugin-syntax-highlight changelog

## 4.0.0

### Major

- Updated Node.js support to `^14.17.0 || ^16.0.0 || >= 18.0.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.
- Removed the package `main` field.
- Removed `./package` from the package `exports` field; the full `package.json` filename must be used in a `require` path.
- Renamed the `index.js` module to `babelPluginSyntaxHighlight.js` and added it to the package `exports` field so it can be deep imported.
- Implemented TypeScript types via JSDoc comments.
- Use the `node:` URL scheme for Node.js builtin module imports in tests.

### Patch

- Updated dependencies.
- Simplified dev dependencies and config for ESLint.
- Simplified package scripts.
- Check TypeScript types via a new package `types` script.
- Various type safety improvements.
- Guard against the edge case where the specified Prism.js language name is the name of one of the `Prism.languages` methods, e.g. `extend`.
- Gracefully error if a template literal string can’t be cooked, e.g. due to an invalid escape sequence with the Babel transform option `parserOpts.errorRecovery` enabled.
- Updated GitHub Actions CI config:
  - No longer run tests with Windows.
  - Run tests with Node.js v14, v16, v18.
  - Updated `actions/checkout` to v3.
  - Updated `actions/setup-node` to v3.
- Configured Prettier option `singleQuote` to the default, `false`.
- Updated tests:
  - Use the [`@babel/core`](https://npm.im/@babel/core) function `transformAsync` instead of `transform`.
  - Use a new [`snapshot-assertion`](https://npm.im/snapshot-assertion) dev dependency to snapshot test error messages.
- Added a `license.md` MIT License file.
- Revamped the readme:
  - Removed the badges.
  - Changed headings.
  - Added a “Requirements” section.
  - Added information about TypeScript config and [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design).
  - Added an “Exports” section.

## 3.0.0

### Major

- Updated Node.js version support to `^12.20 || >= 14.13`.
- Updated dev dependencies, some of which require newer Node.js versions than were previously supported.
- Added a package `exports` field.
- Added a package `sideEffects` field.
- The tests are now ESM in an `.mjs` file instead of CJS in a `.js` file.

### Patch

- Updated dev dependencies.
- Updated GitHub Actions CI config:
  - Also run on pull request.
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Run with Node.js v12, v14, v15, v16.
  - Use the simpler [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
  - Don’t specify the `CI` environment variable as it’s set by default.
- Updated the package scripts:
  - Simpler JSDoc related scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10 automatically generates a Prettier formatted readme.
  - Added a `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
  - Simpler `test:prettier` script arguments.
- Configured Prettier option `semi` to the default, `true`.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Updated the EditorConfig.
- Removed the readme “Support” section.
- Added the `.js` file extension to a [`prismjs`](https://npm.im/prismjs) `require` path.
- Always use regex `u` mode.
- Readme tweaks.

## 2.1.0

### Minor

- Setup [GitHub Sponsors funding](https://github.com/sponsors/jaydenseric):
  - Added `.github/funding.yml` to display a sponsor button in GitHub.
  - Added a `package.json` `funding` field to enable npm CLI funding features.

### Patch

- Updated dev dependencies.
- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Use [`coverage-node`](https://npm.im/coverage-node) for test code coverage.
- Use strict mode for scripts.
- Renamed the `test:units` script to `test:api`.
- Use double quotes around the `test:prettier` script glob for Windows support.
- Added a `.gitattributes` file to enforce `LF` line endings in a Windows environment.
- Test Node.js v13 in CI.
- Prettier ignore `package.json`.
- Comment typo fix.
- Renamed a variable in tests.
- Added more tests.

## 2.0.1

### Patch

- Updated dev dependencies.
- Removed now redundant `eslint-disable-next-line no-console` comments.
- Fixed `${` not being escaped as `\${`.
- Use [`test-director`](https://npm.im/test-director) for tests.
- Moved the readme “Support” section to the end.

## 2.0.0

### Major

- Changed the API from importing a template literal tag, to leading an untagged template literal with a comment that specifies the Prism.js language.
- Removed the now redundant `moduleSpecifier` Babel plugin option.
- Syntax highlighted template literals are now replaced with another template literal, instead of a string.

### Patch

- Updated dev dependencies.
- Updated package description.
- Removed the readme “Todo” section. It’s better to use GitHub issues.
- Aesthetic enhancements to the `TestManager` utility class for managing tests.
- Test that Babel syntax errors have pretty source location info.

## 1.0.0

Initial release.
