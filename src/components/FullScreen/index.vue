<template>
  <!-- 放置一个图标 -->
  <div class="screenWrapper">
    <!-- icon-class的传入 不同的状态下传入不同的icon-class -->
    <svg-icon
      :icon-class="isFull ?'exit-fullscreen': 'fullscreen'"
      class="fullscreen"
      @click="toggleScreen"
    />
  </div>
</template>

<script>
// esc退出全屏 虽然效果上由于浏览器的默认机制 全屏可以退出 但是作为判断条件的isFull还是原来的样子
// 本来应该把isFull的值进行一个操作 但是没有做 所以出现了bug

// 解决办法：监控一下esc的触发 只要你点击了esc isFull的状态同步一下
// 1. 如何监控esc触发呢？ 2.触发的时候如何知道当前是否是全屏状态呢？

// 插件有一个高版本的语法bug -> 安装一个v5  yarn add screenfull@5
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFull: false // flase非全屏
    }
  },
  mounted() {
    // 这里有一个on方法 监控事件的触发 在事件触发的回调中让我们控制icon的状态和是否全屏保持一致
    screenfull.on('change', () => {
      this.isFull = screenfull.isFullscreen
    })
  },
  methods: {
    toggleScreen() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.screenWrapper {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
