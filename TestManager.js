const assert = require('assert')

/** Test manager. */
class TestManager {
  constructor() {
    this.tests = new Map()
  }

  /**
   * Adds a test.
   * @param {string} name Unique test name.
   * @param {Function} test Test to run; may return a Promise.
   */
  addTest(name, test) {
    if (this.tests.has(name))
      throw new Error(`A test called \`${name}\` has already been added.`)

    if (typeof test !== 'function') throw new Error('Test must be a function.')

    this.tests.set(name, test)
  }

  /**
   * Runs all tests.
   * @returns {Promise<void>} Resolves once all tests have run.
   */
  async runTests() {
    let errorCount = 0

    for (var [name, test] of this.tests) {
      // eslint-disable-next-line no-console
      console.log()
      // eslint-disable-next-line no-console
      console.groupCollapsed(`Testing: ${name}`)
      try {
        await test()
      } catch (error) {
        if (error instanceof assert.AssertionError)
          // eslint-disable-next-line no-console
          console.log(error.stack)
        else console.error(error)

        errorCount++
      } finally {
        // eslint-disable-next-line no-console
        console.groupEnd()
      }
    }

    // eslint-disable-next-line no-console
    console.log()
    // eslint-disable-next-line no-console
    console.info(`${errorCount} test error${errorCount === 1 ? '' : 's'}`)

    if (errorCount)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
  }
}

module.exports.TestManager = TestManager
