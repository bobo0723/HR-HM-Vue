<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="showRoleDialog"
          >新增角色</el-button>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="test"
          >测试$http方法新增角色</el-button>
        </el-row>
        <!-- 表格 -->
        <el-table :data="roleList">
          <el-table-column label="序号" width="120" type="index" :index="indexMethod" />
          <el-table-column label="角色名称" width="240" prop="name" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="openAssignDialog(row.id)">分配权限</el-button>
              <el-button size="small" @click="edit(row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="fetchDelRole(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <!--
            核心分页逻辑
            页数 = 总条数 / 每页条数  total/pagesize
            要求需要给组件传递俩个必要参数  1.total 2.page-size[10]
          -->
          <el-pagination
            layout="total, prev, pager, next"
            :current-page="fetchRoleListParams.page"
            :page-size="fetchRoleListParams.pagesize"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增人员弹框 -->
    <el-dialog title="编辑弹层" :visible="roleDialogVisible" @close="closeRoleDialog">
      <!-- 表单内容 -->
      <template #default>
        <el-form ref="roleForm" :model="roleForm" :rules="rulesRoleForm" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
      </template>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-button size="small" @click="closeRoleDialog">取消</el-button>
        <el-button size="small" type="primary" @click="confirmAdd">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 分配权限的弹层 -->
    <el-dialog
      title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
      :visible="showAssignDialog"
      @close="closeAssignDialog"
    >
      <!-- 权限点数据展示 -->
      <template #default>
        <!-- 使用树形控件展示权限点数据
        基本展示三个基础属性配置：
        1. show-checkbox 显示选择框
        2. default-expand-all 默认展开
        3. check-strictly  设置true，可以关闭父子关联 -->
        <el-tree
          ref="tree"
          :data="permissionData"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          :show-checkbox="true"
          :check-strictly="true"
          node-key="id"
        />
      </template>
      <template #footer>
        <div style="text-align: right;">
          <el-button @click="closeAssignDialog">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
/*
1. 渲染table流程：
  1. 准备接口【理解参数】
  2. data中准备一个响应式数据
  3. 调用接口获取数据
  4. 把后端数据交给响应式属性
  5. Table组件绑定响应式属性

2. 分页流程
  1. 理解分页逻辑 页数 = 总数 / 条数
  2. 给组件传递total + page-size

3. 分页和table联动
  效果：当点击页数的时候 table会显示当前页的数据
  思路：
    1. 决定table当前渲染的数据是由什么决定的？page -> 获取新的数据 -> roleList 它一变 视图就会变
    2. 决定当前page是几 谁来决定？分页器点击哪页 当前page就是几

  流程：
  1.点击分页器的页数 -> 得到page
  2.使用最新的page请求数据得到当前页的数据列表
  3.把拿到的新数据重新交给roleList

4. 编辑
  流程：
  1. 回填数据 id调用接口
  2. 用户修改 调用更新接口 和新增复用大部分的逻辑 只需要加一个判断
      判断条件 是否在当前的roleForm表单对象中有一个id 有id 编辑 更新接口 否则还是之前的新增
*/
import { getRoleList, deleteRole, addRole, getRoleDetail, updateRole, getRoleDetailById } from '@/api/setting'
import { getPermissionList, assignPerm } from '@/api/permission'
import transTree from '@/utils/transTree'
import { floor } from 'mathjs'
export default {
  name: 'SettingIndex',
  // 1.封装接口[理解参数] 2.定义一个响应式数据 3.调用接口获取数据 4.把后端获取回来的值赋值给刚刚定义的响应式数据 5.table绑定数组，其各项绑定prop->数据驱动视图 6.进行调试
  data() {
    return {
      // 人员表格数据
      roleList: [],
      fetchRoleListParams: {
        page: 1, // 当前页码
        pagesize: 5 // 每页的条数
      },
      // 总条数
      total: null,
      // 人员信息弹框状态
      roleDialogVisible: false,
      // 人员表单信息数据
      roleForm: {
        name: '',
        description: ''
      },
      // 人员表单信息校验规则
      rulesRoleForm: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      /* ------------------------------------------------------------- */
      // 控制分配权限弹层的显示
      showAssignDialog: false,
      // 存储权限数据
      permissionData: [],
      // 暂存当前角色id
      curId: ''
    }
  },
  created() {
    // 调用更新获取角色列表数据方法
    this.fetchRoleList()
  },
  methods: {
    // 封装获取最新角色列表调用接口方法
    async fetchRoleList() {
      const res = await getRoleList(this.fetchRoleListParams)
      this.roleList = res.rows
      this.total = res.total
    },
    // 页数被点击变化时触发
    handleCurrentChange(page) {
      // console.log(`当前页: ${page}`)
      // 先更新表格数据里的当前page页码
      this.fetchRoleListParams.page = page
      // 更新列表 - 用新数据重新发起请求
      this.fetchRoleList()
    },
    // 根据id删除角色
    fetchDelRole(id) {
      // this.$message / this.$confirm
      // this -> 当前组件实例对象 -> Vue.prototype  [每个组件实例都是通过new VueComponent出来的]
      // 核心：原型链
      // 询问用户确认
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用删除接口删除角色
        await deleteRole(id)
        // 更新列表 - 重新获取列表数据
        this.fetchRoleList()
        // 提示用户
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 打开新增人员弹框
    showRoleDialog() {
      this.roleDialogVisible = true
    },
    // 关闭新增人员弹框
    closeRoleDialog() {
      // 不管你点击取消 还是点击空白区域 还是在新增之后 编辑的更新之后
      // 从逻辑上都会有一步关闭弹框 所以我们可以做一下封装 逻辑收敛
      // 如果当前封装之后 难以理解 分开写 不要怕重复
      // 关闭弹框
      this.roleDialogVisible = false
      // 重置表单数据和规则
      this.$refs.roleForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    // 新增人员 - 确定按钮
    confirmAdd() {
      // 1.兜底校验
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          // 验证通过
          // 提交接口请求
          if (this.roleForm.id) {
            await updateRole(this.roleForm)
          } else {
            // 获取后端最新的人数
            const { total } = await getRoleList(this.fetchRoleListParams)
            // console.log(total)
            // console.log(this.fetchRoleListParams.pagesize)
            // 跳转到新增角色所在的页数
            this.fetchRoleListParams.page = floor(total / this.fetchRoleListParams.pagesize) + 1
            // console.log(this.fetchRoleListParams.page)
            await addRole(this.roleForm)
          }
          // 提示用户成功信息
          this.$message.success(`${this.roleForm.id ? '更新成功' : '新增成功'}`)
          // 刷新列表
          this.fetchRoleList()
          // 关闭窗口
          this.closeRoleDialog()
        }
      })
    },
    // 序号方法
    indexMethod(index) {
      return index * 2 + 2
    },
    // 编辑人员信息
    async edit(id) {
      // 打开窗口
      this.roleDialogVisible = true
      // 调用接口获取后端人员信息数据
      const res = await getRoleDetail(id)
      // 回填数据
      this.roleForm = res
      // 去确认按钮触发兜底校验的那里补全操作
    },
    // 测试新封装的$http方法新增角色
    async test() {
      // 定义要添加的角色
      const obj = {
        name: 'vazbb2',
        description: 'bb'
      }
      const res = await this.$http.post('/sys/role', obj)
      console.log(res)
      // 刷新列表
      this.fetchRoleList()
    },
    // 分配权限
    async openAssignDialog(id) {
      // 打开弹窗
      this.showAssignDialog = true
      // 暂存当前角色id用来点击确定
      this.curId = id
      // 获取当前角色权限列表
      const res = await getPermissionList(id)
      // 存储权限列表数据
      this.permissionData = transTree(res)
      // 获取当前角色已分配权限回填数据（回显）
      // 调用接口
      const detail = await getRoleDetailById(id)
      // 回显数据
      this.$refs.tree.setCheckedKeys(detail.permIds)
    },
    // 关闭分配权限弹窗
    closeAssignDialog() {
      // 关闭弹窗
      this.showAssignDialog = false
      // 清空数据
      this.curId = ''
      this.$refs.tree.setCheckedKeys([])
    },
    // 确定修改分配权限
    async confirm() {
      // 提交修改分配权限请求
      await assignPerm({
        id: this.curId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      // 提示用户
      this.$message.success('分配权限成功')
      // 关闭弹窗并清空数据
      this.closeAssignDialog()
    }
  }

}
</script>

<style>

</style>
