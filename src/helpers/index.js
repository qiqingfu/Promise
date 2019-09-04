/**
 * @author qiqingfu
 * @date 2019-09-04 09:41
 */

const toString = Array.prototype.toString

export function type(item) {
  const reTypeOf = /(?:^\[object\s(.*?)\]$)/
  return toString.call(item)
    .replace(reTypeOf, '$1')
    .toLowerCase()
}

export function isFunction(item) {
  if (typeof item === 'function') {
    return true
  }
  if(item === undefined || item === null) return false
  const type = toString.call(item)
  return type === '[object Function]' || type === '[object GeneratorFunction]'
}

