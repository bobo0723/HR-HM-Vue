// 放置全局指令
// 控制权限点按钮的显示
import Vue from 'vue'
import store from '@/store'
// 添加的所有DOM元素遍历执行
Vue.directive('checkButton', {
  // 指令绑定的元素渲染完毕之后立刻执行
  inserted(el, binding) {
    // el: 指令绑定的元素对象
    // binding: 对象  属性value  存放的时候指令等于号后面的表达式的值
    console.log(el, binding.value)
    // 控制按钮是否显示的逻辑
    // 核心逻辑：以binding.value去points中找 如果找的到就是能显示 如果找不到就是不显示
    const points = store.state.user.userInfo.roles.points
    console.log(points)
    if (!points.includes(binding.value)) {
      // 按钮不显示 直接操作el 用原生的dom方法就可以搞定 移除方法
      // el.remove() // 直接采用remove方法 这个方法兼容性差一点
      el.parentNode.removeChild(el) // 通过自己的父节点把自己删除 兼容更好
    }
  }
})
