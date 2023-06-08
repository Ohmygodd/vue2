import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
function Vue (options) {
    // debugger
    this._init(options)

}
// 给Vue上挂在一些东西
initMixin(Vue)
initLifeCycle(Vue)

export default Vue