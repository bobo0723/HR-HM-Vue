<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <!-- 放置表单 -->
        <el-form ref="userForm" label-width="120px" :model="userInfo" :rules="rules" style="margin-left: 120px; margin-top:30px">
          <el-form-item label="姓名:" prop="username">
            <el-input v-model="userInfo.username" style="width:300px" />
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" disabled style="width:300px" />
          </el-form-item>

          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label="员工头像">
            <!-- <UploadImg :url="userInfo.staffPhoto" @get-url="getUrl" /> -->
            <UploadImg v-model="userInfo.staffPhoto" />
          </el-form-item>

          <!-- 保存个人信息 -->
          <el-row class="inline-info" type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" @click="confirm">保存更新</el-button>
              <el-button @click="$router.back()">返回</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
// import uploading from '@/components/Uploading/index.vue'
import { getUserDetailById, saveUserDetailById } from '@/api/employee'
export default {
  // components: {
  //   uploading
  // },
  data() {
    return {
      userInfo: {
        username: '',
        staffPhoto: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchUserInfoById()
  },
  methods: {
    // 获取用某个员工的信息
    async fetchUserInfoById() {
      const id = this.$route.query.id
      const res = await getUserDetailById(id)
      // console.log(res)
      this.userInfo = res
    },
    // 保存更新按钮
    async confirm() {
      await saveUserDetailById(this.userInfo)
      // 重新获取数据刷新列表
      this.fetchUserInfoById()
      this.$message.success('更新成功')
      // 跳回员工管理页面
      // this.$router.push('/employee')
    },
    // 使用事件接受子组件传过来的imageUrl的值
    getUrl(url) {
      console.log(url)
      // 图片上传完毕之后 用于提交给后端的字段里就有了有效的url
      this.userInfo.staffPhoto = url
    }
  }
}
</script>
<style>
</style>
