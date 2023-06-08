
import { complieToFuntion } from './compiler/index'
import { mountComponent } from './lifecycle'
import {initState} from './state'

export function initMixin(Vue) {
    Vue.prototype._init  = function (options) {
        const vm = this
        // 挂载options
        this.$options = options
        // 初始化
        initState(vm)

        if (options.el) {
            vm.$mount(options.el);
        }
    }
    Vue.prototype.$mount = function(el) {
        const vm = this;
        el = document.querySelector('#app');
        let ops = vm.$options;
        // console.log(ops);
        if (!ops.render) {
            let template;
            if(!ops.template && el) {
                template = el.outerHTML;
            }// 有模板并且有写el元素
            else {
                if (el) {
                    template = ops.template
                }
            }
            // console.log(template);
            // debugger
            if (template) {
                // 编译
                const render = complieToFuntion (template);
                // console.log(render);
                ops.render = render;

            }
        }
        mountComponent(vm,el);
    }
}
