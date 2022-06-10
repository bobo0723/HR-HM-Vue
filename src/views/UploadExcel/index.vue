<template>
  <div>
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExce/index.vue'
import { getImportJsData } from '@/utils/excel.js'
import { importEmployee } from '@/api/employee'
export default {
  name: 'ImportExcel',
  components: {
    UploadExcel
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '请勿上传超过1M大小的文件',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      console.log(results)
      console.log(header)
      // 1.拿到数据 通过格式化方法 处理成后端要求的数据格式
      // 2.调用真实接口传递数据
      const headerRelation = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName'
      }
      const formatData = await getImportJsData(results, headerRelation)
      await importEmployee(formatData)
      this.$message.success('导入成功')
      // 刷新列表
      this.$router.push('/employee')
    }
  }
}
</script>

<style>

</style>
