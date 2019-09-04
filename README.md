# PromiseYang
promise 模拟实现

## 模拟的方法
 - .then(resolved, rejected), 链式调用
 - .catch(rejected), catch 捕获错误
 - PromiseYang.resolve(), 方法也会返回一个新的 Promise 实例，该实例的状态为rejected
 - PromiseYang.reject(), 方法也会返回一个新的 Promise 实例, 该实例的状态为 resolved
 - PromiseYang.defer() | PromiseYang.deferred(), 创建延迟的 promise
 - PromiseYang.all(promises), 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例
 - PromiseYang.race(promises), 同时执行多个异步，然后哪个快，就用哪个的结果，race的意思是赛跑

