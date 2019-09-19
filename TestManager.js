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
    let passCount = 0
    let failCount = 0

    for (const [name, test] of this.tests) {
      // eslint-disable-next-line no-console
      console.group(
        // Bright.
        `\n\x1b[1m${name}\x1b[0m`
      )

      try {
        await test()
        passCount++
      } catch (error) {
        failCount++
        console.error(
          // Dim, red.
          `\x1b[2m\x1b[31m${error.stack}\x1b[0m`
        )
      } finally {
        // eslint-disable-next-line no-console
        console.groupEnd()
      }
    }

    console.info(
      // Bright.
      `\n\x1b[1m${
        failCount
          ? // Red.
            '\x1b[31m'
          : // Green.
            '\x1b[32m'
      }${passCount}/${this.tests.size} tests passed.\x1b[0m\n`
    )

    if (failCount)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
  }
}

module.exports.TestManager = TestManager
