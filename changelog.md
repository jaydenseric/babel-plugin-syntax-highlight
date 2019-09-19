# babel-plugin-syntax-highlight changelog

## Next

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
