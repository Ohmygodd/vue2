import {observe} from "./observe/index";
export function initState(vm) {
    const options = vm.$options;
    // 判断是否有data  可能是 函数 可能是 对象
    if (options.data) {
        initData(vm);
    }
}
function proxy (vm,target,key) {
    Object.defineProperty(vm,key,{
        get () {
            return vm[target][key];
        },
        set (newValue) {
            vm[target][key]  = newValue
        }
    })
}
function initData(vm) {
    let data = vm.$options.data;
    // 判断是对象还是函数，是函数就执行函数，是对象就直接赋值
    data = typeof data === 'function' ? data.call(vm) : data
    // console.log(data);   
    vm._data = data
    observe(data)
    // 将_data用vm 来代理

    for (let key in data) {
        proxy(vm,'_data',key);
    }
}