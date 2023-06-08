const oldArrayProto = Array.prototype;
// newArrayPropto 继承 oldArrayProto
export let newArrayPropto = Object.create(oldArrayProto);

let methods = ["push", "pop", "shift", "unshift", "reverse", "sort", "splice"];
methods.forEach((method) => {
  // 函数劫持
  newArrayPropto[method] = function (...args) {
    const res = oldArrayProto[method].call(this, ...args);
    // 对新增的数据进行劫持
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args
        break;
      case 'splice': // 因为前两个参数是位置个数量参数
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if(inserted) {
        ob.observeArray(inserted)
    }
    return res;
  };
});
