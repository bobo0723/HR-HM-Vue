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
          <el-button type="primary" size="small">导入excel</el-button>
          <el-button type="primary" size="small">导出excel</el-button>
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
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
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
      <add-employee :dialog-visible="dialogVisible" @close-dialog="closeDialog" @fetch-tableList="fetchTableList" />
    </div>
  </div>
</template>
<script>
// import PageTools from '@/components/PageTools/index.vue' - 这里使用的是全局注册的工具组件，就不用使用components定义为私有组件了
import addEmployee from './components/add-employee.vue'
import { getEmployeeList, delEmployee } from '@/api/employee.js'
import dayjs from 'dayjs'
export default {
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
      dialogVisible: false
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
    showDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

<style>

</style>
