<template>
  <div>
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel/index.vue'
import { getImportJsData } from '@/utils/excel.js'
import { importEmployee } from '@/api/employee'
export default {
  name: 'ImportExcel',
  components: {
    UploadExcel
  },
  methods: {
    // 解析前校验
    beforeUpload(file) {
      // 如果在这里校验不过不会进行正式的解析操作
      // 这个函数必须return一个布尔值 并且只有return出去的是true的时候才会执行后续的解析操作
      const isLt1M = file.size / 1024 / 1024 < 1 // 小于1M
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '请勿上传超过1M大小的文件',
        type: 'warning'
      })
      return false
    },
    // 解析成功后
    async handleSuccess({ results, header }) {
      // 插件把一个excel解析成了普通的对象数组 和一个代表表头的 字符串数组
      // console.log(results, header)
      // 1.拿到数据 通过格式化方法 处理成后端要求的数据格式
      // 2.调用真实接口传递数据
      // 1.调用合适的接口js数据加入到后端的数据
      // 2.后端接口要求的格式又和我们插件解析出来的格式对不上
      // 3.提交之前先做二次转化 然后再提交 [直接使用现成的转化工具函数]
      // 设置格式化规则
      const headerRelation = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName'
      }
      const formatData = await getImportJsData(results, headerRelation)
      // 调用批量导入接口
      await importEmployee(formatData)
      // 提示用户
      this.$message.success('导入成功')
      // 刷新列表
      this.$router.push('/employee')
    }
  }
}
</script>

<style>

</style>
