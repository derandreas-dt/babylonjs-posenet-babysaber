

/**
 * Throttles a function to "timeFrame" ms
 *
 * Useful during development, when a console.log
 * is pushing every 5-10ms to dev console and dev console
 * freezes.
 *
 * Example use:
 *
 * const log = ll(console.log, 500)
 * log('hello')
 *
 * @param {Function} func Function to throttle
 * @param {Number} timeFrame ms to throttle the func call
 * @returns {Function}
 */
const throttle = (func, timeFrame) => {
  var lastTime = 0
  return function (...args) {
    var now = new Date()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}

export {
  throttle
}
