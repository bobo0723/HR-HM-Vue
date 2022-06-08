// 编写ComponentsIndex全局插件 - 这里会将所有的components组件进行全局注册

// 引入PageTools工具组件
import PageTools from '@/components/PageTools/index.vue'

// 插件优化
// 为什么要优化？ 因为有可能还有很多的全局组件都需要进行同等的操作 mainjs就会变的比较大 不够精简
// 实现的效果？ Vue.use(componentPlugin) -> 把components中的所有组件都统一完成全局注册
// 插件的语法
// 1. 定义插件（开发）  2.注册插件（Vue.use）
// 对象定义法

// 默认导出
export default {
  // 执行时会自动调用install方法，并传入Vue实例对象，Vue构造函数能做的这里都可以做
  install: (Vue) => {
    // console.dir(Vue)
    // 注册PageTools工具组件
    Vue.component(PageTools.name, PageTools)
    // Vue:构造函数
    // Vue.component
    // Vue.prototype.$http = fn
    // 只要Vue构造函数能力所及都可以作为插件来玩
    // 定义插件的逻辑
  }
}
