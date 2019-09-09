const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/index')
const package = require('./package.json')

// Load every available Prism.js language.
loadLanguages()

module.exports = function babelPluginSyntaxHighlight({ types }) {
  return {
    name: 'syntax-highlight',
    visitor: {
      ImportDeclaration(
        path,

        // Destructuring this would break the context for instance methods.
        state
      ) {
        const { moduleSpecifier = package.name } = state.opts

        // Does the import module specifier match the one configured?
        if (path.node.source.value === moduleSpecifier) {
          const importDefaultSpecifier = path.node.specifiers.find(
            ({ type }) => type === 'ImportDefaultSpecifier'
          )

          if (importDefaultSpecifier)
            throw state.buildCodeFrameError(
              importDefaultSpecifier,
              'Unexpected default import.'
            )

          const importSpecifiers = path.node.specifiers.filter(
            ({ type }) => type === 'ImportSpecifier'
          )

          if (!importSpecifiers.length)
            throw state.buildCodeFrameError(path.node, 'Missing named imports.')

          importSpecifiers.forEach(importSpecifier => {
            const prismLanguage = Prism.languages[importSpecifier.imported.name]

            if (!prismLanguage)
              throw state.buildCodeFrameError(
                importSpecifier,
                `\`${importSpecifier.imported.name}\` isn’t an available Prism.js language.`
              )

            // Process all references to the named import’s local name.
            path.scope
              .getBinding(importSpecifier.local.name)
              .referencePaths.forEach(referencePath => {
                if (
                  referencePath.parentPath.node.type !==
                  'TaggedTemplateExpression'
                )
                  throw state.buildCodeFrameError(
                    referencePath.node,
                    'Not tagging a template string of code to syntax highlight.'
                  )

                if (referencePath.parentPath.node.quasi.expressions.length)
                  throw state.buildCodeFrameError(
                    referencePath.parentPath.node.quasi.expressions[0],
                    'Template string placeholders aren’t supported.'
                  )

                const code = referencePath.parentPath.node.quasi.quasis
                  .map(quasi => quasi.value.cooked)
                  .join('')

                const highlightedCode = Prism.highlight(code, prismLanguage)

                // Replace the tagged template string with the highlighted code
                // string.
                referencePath.parentPath.replaceWith(
                  types.stringLiteral(highlightedCode)
                )
              })
          })

          // Remove the dummy import.
          path.remove()
        }
      }
    }
  }
}
