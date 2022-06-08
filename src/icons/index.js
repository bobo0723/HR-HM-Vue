import Vue from 'vue'
// 导入SvgIcon组件
import SvgIcon from '@/components/SvgIcon'
// 组件全局注册的API  页面组件中通过 <svg-icon/>
Vue.component('svg-icon', SvgIcon)

// 把svg目录下的所有的.svg文件都变成 模块化可用的状态
// 这里的所有图标都是UI提交做好的 切图给我们
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  requireContext.keys().map(requireContext)
}

requireAll(req)
