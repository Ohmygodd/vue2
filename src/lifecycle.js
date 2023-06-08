import { createElementVNode, createTextVNode } from "./vdom/index"

export function initLifeCycle(Vue) {
    Vue.prototype._update = function () {
        console.log('update')

    },
    // 'div', {},...children
    Vue.prototype._c = function () {
       return createElementVNode(this,...arguments)

    }

    // _v(text)
    Vue.prototype._v = function () {
        return createTextVNode(this,...arguments)
    }
    //
    Vue.prototype._s = function (value) {
        return JSON.stringify
    }
    Vue.prototype._render = function () {
        console.log('render')
        const vm = this;
        // 让with的this指向vm
        return vm.$options.render.call(vm);
    }
}
export function mountComponent(vm,el) {
    // 调用render方法产生虚拟dom
    vm._update(vm._render())
    // 根据虚拟dom产生真实dom
}