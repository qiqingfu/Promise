/**
 * @author qiqingfu
 * @date 2019-09-03 21:59
 */

const event = {
  list: {},
  // 订阅
  on: function(key,fn) {
    if (!this.list[key]) {
      this.list[key] = []
    }

    this.list[key].push(fn)
  },
  // 发布
  emit: function() {
    const key = Array.prototype.shift.call(arguments)
    const fns = this.list[key]

    if (!fns || fns.length === 0) {
      return false
    }

    fns.forEach(fn => {
      fn.apply(this, arguments)
    })
  }
}

// 测试
event.on('a', function(name) {
  console.log(name)
})

event.on('b', function(age) {
  console.log(age)
})

event.emit('a', 'zhangsan')
event.emit('b', 23)
