/**
 * @author qiqingfu
 * @date 2019-09-04 09:28
 */

import {type, isFunction} from "../helpers/index.js"

/**
 *
 * @param promise2 {Promise}
 * @param x        Promise | arbitrary value
 * @param resolve  {function}
 * @param reject   {function}
 */
export function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }

  let called
  if (x !== null && x !== undefined && (type(x) === 'object' || isFunction(x))) {
    try {
      /**
       * x may be a promise, promise have then in prototype
       */
      let then = x.then
      if (isFunction(then)) {
        /**
         * x is a promise
         * If a promise is returned, the result of promise is taken as the parameter of the next one.
         */
        then.call(x, r => {
          if (called) return
          called = true

          resolvePromise(promise2, r, resolve, reject)
        }, err => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}
