<template>
  <div class="salary-container">
    <el-button v-checkButton="'CKGZ'">查看工资</el-button>
    <el-button v-checkButton="'ZGZ'">涨工资</el-button>
  </div>
</template>
<script>
export default {
  name: 'Salary'
}
</script>

<style lang="scss" scoped>
// sfc style支持多种预处理的器的  lang指定对应的预处理器
// scss、less 浏览器不认识 loader做转化 -> css
// 1. 变量
// 2. 嵌套语法  结构统一好理解 嵌套层侧别太深
// 3. 模块化  js css 俩个问题：复用 + 好维护

// 补充：
// 1. 在哪个style语法块中导入 就在哪个组件中生效 不是全局的
// 2. ~保证别名路径@ （src）在这里能正确识别 固定的语法
// 3. import vs @import  import js模块  @import css
// 4. mainjs导入的模块都是全局生效的
// 5. 本地模块和三方模块 本地和三方都是可以进行导入的

@import '~@/styles/variables.scss';
$hight-color: red;
$border-base: 1px solid #ccc;
.salary-container{
  padding:30px;
  color: $hight-color;
  .salary-text{
    border: $border-base;
    color:$orange;
  }
}
</style>
