const chalk = require('chalk')

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
      console.group(`\nTest: ${chalk.bold(name)}`)

      try {
        await test()
        passCount++
      } catch (error) {
        failCount++
        console.error(chalk.dim.red(error.stack))
      } finally {
        console.groupEnd()
      }
    }

    console.info(
      `\n${chalk.bold[failCount ? 'red' : 'green'](
        `${passCount}/${this.tests.size} tests passed.`
      )}\n`
    )

    if (failCount)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
  }
}

module.exports.TestManager = TestManager
