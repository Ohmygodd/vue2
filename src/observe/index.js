import { newArrayPropto } from "./array";

class Observer {
  constructor(data) {
    // data.__ob__ = this; // 这样会死循环
    // 不可枚举 来中断observerArray方法对__ob__的循环
    Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
    })

    if (Array.isArray(data)) {
      // 检测数组中的对象
      this.observerArray(data);

      data.__proto__ = newArrayPropto
      // 重写数组方法，
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    // 循环对象
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observerArray(data) {
    data.forEach((item) => observe(item));
  }
}
export function defineReactive(target, key, value) {
  // 对属性值还是对象的数据再一次进行代理
  observe(value); // 深度劫持
  Object.defineProperty(target, key, {
    get() {
      console.log("获取");
      return value;
    },
    set(newValue) {
      console.log("修改");
      if (newValue === value) return;
      value = newValue;
    },
  });
}
export function observe(data) {
  // debugger
  // 只对对象进行劫持，如果不是则直接return
  if (typeof data !== "object" || data == null) {
    return;
  }
  if (data.__ob__ instanceof Observer) {// 如果有观测对象则表示被观测过了，直接返回
    return  data.__ob__;
  }
  // console.log(data);
  return new Observer(data);
}
