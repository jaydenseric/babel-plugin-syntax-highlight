# babel-plugin-syntax-highlight changelog

## Next

### Patch

- Updated dev dependencies.
- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Use strict mode for scripts.
- Renamed the `test:units` script to `test:api`.
- Test Node.js v13 in CI.
- Prettier ignore `package.json`.
- Comment typo fix.

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
