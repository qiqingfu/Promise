/**
 * @author qiqingfu
 * @date 2019-09-03 22:24
 */

import {resolvePromise} from "./core/resolvePromise.js"
import {isFunction} from "./helpers/index.js"

const STATUS_MAP = {
  0: 'pending',
  1: 'resolved',
  2: 'rejected'
}

class PromiseYang {
  constructor(executor) {
    this.value = undefined
    this.reason = undefined
    this.status = STATUS_MAP[0]
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    /**
     * @param value
     * new Promise((resolve) => {})
     */
    function resolve(value) {
      if (this.status === STATUS_MAP[0]) {
        this.value = value
        this.status = STATUS_MAP[1]
        /**
         * sunscribe
         * fn is a callback function subscribed to when the state is pending in the then. Internally,
         * we call successful or failed callbacks.
         */
        this.onResolvedCallbacks.forEach(fn => fn.call(this))
      }
    }

    /**
     * @param reason
     * new Promise((resolve, reject) => {})
     */
    function reject(reason) {
      if (this.status === STATUS_MAP[0]) {
        this.reason = reason
        this.status = STATUS_MAP[2]
        /**
         * sunscribe
         * fn is a callback function subscribed to when the state is pending in the then. Internally,
         * we call successful or failed callbacks.
         */
        this.onRejectedCallbacks.forEach(fn => fn.call(this))
      }
    }

    /**
     * new Promise((arg1, arg2) => {})
     * new Error('error!')
     */
    try {
      executor(resolve.bind(this), reject.bind(this))
    } catch (e) {
      reject(e)
    }
  }

  /**
   * The then method is asynchronous
   * @param onFulfilled
   * @param onRejected
   * @return {PromiseYang}
   */
  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : val => val
    onRejected = isFunction(onRejected) ? onRejected : err => {throw err}
    const self = this
    let promise2 = new PromiseYang((resolve, reject) => {
      if (self.status === STATUS_MAP[1]) {
        setTimeout(function() {
          try {
            /**
             * The return value of the previous promise then successfully callback
             * will be accepted as the value of the new promise
             */
            let x = onFulfilled.call(self, self.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        },0)
      }

      if (self.status === STATUS_MAP[2]) {
        setTimeout(function() {
          try {
            let x = onRejected.call(self, self.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        },0)
      }

      /**
       * When Promise performs an asynchronous operation and the state in the then method is pending,
       * we subscribe first
       * The result returned by the last promise.then may be asynchronous
       */
      if (self.status === STATUS_MAP[0]) {
        self.onResolvedCallbacks.push(() => {
          setTimeout(function() {
            try {
              let x = onFulfilled.call(self, self.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        self.onRejectedCallbacks.push(() => {
          setTimeout(function() {
            try {
              let x = onRejected.call(self, self.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    /**
     * The then method returns a completely new promise object each time
     */
    return promise2
  }
}

export default PromiseYang
