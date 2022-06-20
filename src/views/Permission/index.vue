<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission({type:1, pid:''})">添加一级权限</el-button>
        </div>
        <el-table :data="permissionList" row-key="id" border>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="addPermission({type:2, pid:row.id})">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="removePermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 添加对话框 -->
    <el-dialog :visible="showDialog" title="弹层标题" @close="closeDialog">
      <el-form label-width="100px">
        <el-form-item label="权限名称">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <!--
            值的定制 active-value 默认情况下 切换时是进行的true和false的切换 有可能和后端对应不上 后端要的0/1
            文案的定制 active-text
            背景色的定制  active-color
          -->
          <el-switch
            v-model="formData.enVisible"
            active-text="启用"
            active-value="1"
            inactive-text="不启用"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission'
import transTree from '@/utils/transTree'
export default {
  name: 'PermissionIndex',
  data() {
    return {
      permissionList: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型 区分当前是添加一级权限点还是二级权限点
        pid: '' // 添加到哪个父节点下
      }
    }
  },
  created() {
    // 调用获取权限列表
    this.fetchPermissionList()
  },
  methods: {
    // 获取权限列表
    async fetchPermissionList() {
      const res = await getPermissionList()
      console.log(res)
      this.permissionList = transTree(res)
    },
    // 新增权限
    addPermission({ type, pid }) {
      // 打开对话框
      this.showDialog = true
      // 不管点击的是哪个添加按钮 formData中都能得到存入正确的type和id  区分当前是添加一级权限点还是二级权限点
      this.formData.type = type
      this.formData.pid = pid
    },
    // 关闭添加对话框
    closeDialog() {
      // 关闭对话框
      this.showDialog = false
      // 重置数据
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型 区分当前是添加一级权限点还是二级权限点
        pid: '' // 添加到哪个父节点下
      }
    },
    // 删除权限按钮
    removePermission(id) {
      // 警告用户
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 发起删除请求
        await delPermission(id)
        // 更新列表
        this.fetchPermissionList()
        // 提示用户成功
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 确认添加
    async confirm() {
      // TODO - 表单兜底校验
      // 根据是否有id值判断调用哪个接口
      if (this.formData.id) {
        // 提交修改接口
        await updatePermission(this.formData)
        this.$message.success('更新成功')
      } else {
        // 提交新增接口
        await addPermission(this.formData)
        this.$message.success('添加成功')
      }
      // 更新列表
      this.fetchPermissionList()
      // 关闭弹窗
      this.closeDialog()
    },
    // 修改权限信息
    async editPermission(id) {
      // 打开对话框
      this.showDialog = true
      // 回填数据
      const res = await getPermissionDetail(id)
      this.formData = res
      // 存入id
      this.formData.id = id
    }
  }
}
</script>
<style></style>
