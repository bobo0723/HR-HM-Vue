<template>
  <el-card>
    <div class="page-tools">
      <!-- 左侧 -->
      <div class="left">
        <slot name="left" />
        <!-- <div class="tips">
          <i class="el-icon-info" />
          <span>本月: 社保在缴 公积金在缴</span>
        </div> -->
      </div>
      <!-- 右侧 -->
      <div class="right">
        <slot name="right" />
        <!-- <el-button type="primary" size="small">历史归档</el-button>
        <el-button type="primary" size="small">导出</el-button> -->
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools'
}
</script>

<style lang="scss" scoped>
.page-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  ::v-deep.tips {
    line-height: 34px;
    padding: 0px 15px;
    border-radius: 5px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
    i {
      margin-right: 10px;
      color: #409eff;
    }
  }
}
</style>
