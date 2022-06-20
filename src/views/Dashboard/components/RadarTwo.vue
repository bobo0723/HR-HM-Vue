<template>
  <div>
    <div ref="radar" class="radar" style="width: 600px; height: 400px" />
  </div>
</template>

<script>
// 导入核心包
import * as echarts from 'echarts'
// 让组件可以进行参数定制化？ 父传子传递参数 达到一个复用的目的 很多地方都有可能用到雷达图
// 设计为props 在实际开发的过程中 有很多很多的业务参数都有可能会被定制 只要是需要被定制的都可以进行props抽离
export default {
  name: 'Radar',
  props: {
    indicator: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    // 子组件监听父组件传入的随时更改的数据变化 并重新渲染
    indicator(newVal, oldVal) {
      // newVal是新值，oldVal是旧值
      // 这里传下来以后就自动是最新值了，更改了数据只需要重新渲染一遍就可以了
      // this.radarInit()
      // 使用this挂载数据共享
      this.myChart.setOption({
        ...this.option,
        radar: {
          // shape: 'circle',
          indicator: this.indicator
        }
      })
    }
  },
  mounted() {
    this.radarInit()
  },
  methods: {
    radarInit() {
      // 获取一个渲染图表的dom节点 -> vue如何获取dom元素？  ref + this.$refs.echart
      this.chartDom = this.$refs.radar
      // 把echart渲染到准备好的dom节点中  -> vue中如何保证一个dom已经可以使用？ 钩子函数？ mounted
      this.myChart = echarts.init(this.chartDom)
      // 定制Echart参数
      this.option = {
        radar: {
          // shape: 'circle',
          indicator: this.indicator
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      }
      // 把配置项数据渲染到我们已经准备好的图标实例中
      this.option && this.myChart.setOption(this.option)
    }
  }
}
</script>

<style>

</style>
