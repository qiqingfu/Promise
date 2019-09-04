/**
 * @author qiqingfu
 * @date 2019-09-03 21:59
 */

const fs = require('fs')

const event = {
  hooks: [],
  result: [],
  // 订阅
  on: function(cb) {
    this.hooks.push(cb)
  },
  emit: function(data) {
    this.result.push(data)
    this.hooks.forEach(hook => hook(this.result))
  }
}

event.on(function(data) {
  if (data.length === 2) {
    console.log('end!')
    console.log(data)
  }
})

fs.readFile('./a.txt', 'utf-8', (err, data) => {
  event.emit(data)
})

fs.readFile('./b.txt', 'utf-8', (err, data) => {
  event.emit(data)
})

