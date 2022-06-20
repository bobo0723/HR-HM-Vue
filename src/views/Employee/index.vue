<template>
  <div class="employees-container">
    <div class="app-container">
      <page-tools>
        <!-- 插入到left插槽位置 -->
        <template #left>
          <i class="el-icon-info" />
          <span>本月: 社保在缴 公积金在缴</span>
        </template>
        <!-- 插入到right插槽位置 -->
        <template #right>
          <el-button type="primary" size="small" @click="$router.push('upload-excel')">导入excel</el-button>
          <el-button type="primary" size="small" @click="handleDownload">导出excel</el-button>
          <el-button type="primary" size="small" @click="showDialog">新增员工</el-button>
        </template>
      </page-tools>
      <el-card style="margin-top: 10px;">
        <el-table :data="tableList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <!--
            prop指定对应要渲染的字段就可以原样输出
            如果你想要进行转化 prop是不行
            如果要转二次转化  借助插槽 拿到原始数据 做处理之后 在输出
          -->
          <el-table-column label="聘用形式">
            <template #default="{ row }">
              {{ formOfEmploymentFormat(row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <!-- 入职时间 - 需要格式化 -->
          <el-table-column label="入职时间" width="180">
            <!--
              差值表达式可以支持方法调用不？可以 如果写一个函数调用 渲染的是啥？函数的返回值
              思路：编写一个格式化的函数 在函数里面进行有效的格式化 最后把格式化之后的数据return
            -->
            <template #default="{ row }">
              {{ timeOfEntryFormat(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="goDetail(row.id)">查看</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="remove(row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <br>
        <el-pagination
          layout="total, prev, pager, next"
          :current-page="params.page"
          :page-size="params.size"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </el-card>
      <!-- 子组件 add-employee -->
      <add-employee :dialog-visible="dialogVisible" @close-dialog="closeDialog" @fetch-tableList="fetchTableList" />
      <!-- 分配角色弹框 -->
      <template>
        <el-dialog class="assign-role" title="分配角色" :visible="showRoleDialog" @close="closeRoleDialog">
          <!-- 这里准备复选框 -->
          <template #default>
            <el-checkbox-group v-model="checkList">
              <!-- 注意：label决定当前选中的值 - 传给后端的字段 -->
              <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
                <!-- 多选框 el-checkbox 里有个默认插槽 -->
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <template #footer>
            <el-button type="primary" size="small" @click="confirm">确定</el-button>
            <el-button size="small" @click="closeRoleDialog">取消</el-button>
          </template>
        </el-dialog>
      </template>
    </div>
  </div>
</template>
<script>
// import PageTools from '@/components/PageTools/index.vue' - 这里使用的是全局注册的工具组件，就不用使用components定义为私有组件了
import addEmployee from './components/add-employee.vue'
import { getEmployeeList, delEmployee, assignRoles } from '@/api/employee.js'
import { getExportData } from '@/utils/excel'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'EmployeeIndex',
  components: {
    addEmployee
  },
  data() {
    return {
      // 员工表格的响应式数据
      tableList: [],
      params: {
        page: 1, // 当前页
        size: 5 // 每页条数
      },
      // 总页数
      total: null,
      // 弹窗是否显示
      dialogVisible: false,
      // 分配角色弹框
      showRoleDialog: false,
      // 暂存id提交更改分配权限用
      curId: '',
      // 分配角色复选框数据列表
      checkList: [], // 选中项的lable值
      // 渲染出来的暂存的获取到的角色列表
      roleList: []
    }
  },
  created() {
    // 调用获取员工数据方法
    this.fetchTableList()
  },
  methods: {
    // 封装获取员工数据方法
    async fetchTableList() {
      const res = await getEmployeeList(this.params)
      // console.log(res)
      this.tableList = res.rows
      this.total = res.total
    },
    // 聘用形式字段的格式转换
    // 格式化
    // 通过枚举的写法定义一个对象关系
    // 好处：1. 它可以简化ifelse分支语句  2.对应关系清晰明了方便灵活扩展
    formOfEmploymentFormat(value) {
      // 使用枚举格式转换
      const format = {
        1: '正式',
        2: '非正式',
        3: '临时',
        4: '老板亲戚'
      }
      return format[value]
    },
    // 入职时间字段的格式转换
    timeOfEntryFormat(value) {
      return dayjs(value).format('YYYY-MM-DD')
    },
    // 当前页改变时触发的函数
    handleCurrentChange(page) {
      this.params.page = page
      // 重新调用接口刷新列表
      this.fetchTableList()
    },
    // 删除角色
    remove(id) {
      // console.log(id)
      // 提醒用户是否确认删除
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用删除接口删除角色
        await delEmployee(id)
        // 调用接口刷新列表
        this.fetchTableList()
        // 提示用户删除成功
        this.$message({
          type: 'success',
          message: '删除成功!!'
        })
      })
    },
    // 打开对话框
    showDialog() {
      this.dialogVisible = true
    },
    // 关闭对话框
    closeDialog() {
      this.dialogVisible = false
    },
    // 导出excel
    handleDownload() {
      import('@/vendor/Export2Excel').then(async(excel) => {
        // console.log(excel)
        const res = await getEmployeeList(this.params)
        // console.log(res.rows)
        const headerRelation = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '工号': 'workNumber',
          '聘用形式': 'formOfEmployment',
          '部门': 'departmentName'
        }
        const { data } = await getExportData(res.rows, headerRelation)
        // console.log(data)
        // console.log(Object.keys(headerRelation))
        // debugger
        excel.export_json_to_excel({
          header: Object.keys(headerRelation), // 表头 必填
          data: data, // 具体数据 必填
          filename: 'excel-list', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 跳转员工详情页面
    goDetail(id) {
      this.$router.push({
        path: '/detail',
        query: {
          id
        }
      })
    },
    // 分配角色 - 打开分配角色弹窗
    async editRole(id) {
      // 存下id用在确认时提交参数
      this.curId = id
      // 打开弹窗
      this.showRoleDialog = true
      // 获取全部角色列表接口
      const res = await getRoleList({
        page: 1,
        pagesize: 100
      })
      // console.log(res.rows)
      this.roleList = res.rows
      // 根据id获取当前员工已分配的角色权限
      // console.log(id)
      const res2 = await getUserDetailById(id)
      // console.log(res2.roleIds)
      this.checkList = res2.roleIds
    },
    // 关闭分配角色对话框
    closeRoleDialog() {
      this.curId = ''
      this.showRoleDialog = false
    },
    // 确认分配角色
    async confirm() {
      // @param: { id:当前用户id, roleIds:选中的角色id组成的数组 }
      await assignRoles({
        id: this.curId,
        roleIds: this.checkList
      })
      // 提示用户
      this.$message.success('分配角色权限成功')
      // 关闭弹窗
      this.closeRoleDialog()
    }
  }
}
</script>

<style>

</style>
