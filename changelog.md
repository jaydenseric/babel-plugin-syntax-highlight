# babel-plugin-syntax-highlight changelog

## Next

### Major

- Updated Node.js version support to `^12.20 || >= 14.13`.

### Patch

- Updated dev dependencies.
- Updated GitHub Actions CI config:
  - Also run on pull request.
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Run with Node.js v12, v14, v15, v16.
  - Use the simpler [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
  - Don’t specify the `CI` environment variable as it’s set by default.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Updated the EditorConfig.
- Removed the readme “Support” section.

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
