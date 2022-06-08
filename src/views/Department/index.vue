<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 bootstrap 行列布局 平分成24份 每个模块占几份 保持5:1 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <el-col>操作</el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 树形组件 -->
        <!-- data是一个核心参数 代表树形组件要渲染的数据 -->
        <!-- 加冒号可以正确识别类型 不加冒号是字符串 但是存在隐式转换 转成true 但是js里永远杜绝隐式转换 -->
        <el-tree :data="list" :props="defaultProps" :default-expand-all="true">
          <!-- 默认插槽来 渲染更加复杂的自定义内容 用的是新语法 #default === v-slot -->
          <!-- data是作用域插槽抛出的参数  代表的是当前数据中的每一个数据对象 -->
          <!-- data名称是固定的 不能写成别的 解构语法 属性名是确定的!!! 具体属性名叫啥名名字 以文档为主-->
          <template #default="{data}">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; width: 100%;"
            >
              <el-col :span="20">
                <span>{{ data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="addDepartment(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="editDepartment(data.id)">编辑部门</el-dropdown-item>
                        <el-dropdown-item @click.native="removeDepartment(data.id)">删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!--
      新增弹框 如果把所有的逻辑都放在当前的vue文件中 可能会特别大 维护起来就会比较困难
      把新增弹框的部分抽象成一个组件 把dialog部分单独作为一个组件抽象出去 父子通信
    -->
    <add-department
      ref="addDepart"
      :show-dialog="dialogVisible"
      :cur-id="curId"
      @close-dialog="closeDialog"
      @reset-data="resetData"
      @fetch-departments="fetchDepartments"
      @cancel="closeDialog"
    />
  </div>
</template>

<script>
import { getDepartments } from '@/api/department'
import transTree from '@/utils/transTree'
import addDepartment from './components/add-department.vue'
// 新增部门： 1. 点击打开弹框弹框交互  2. 表单数据收集 3. 调用接口 4. 后续的操作 更新列表 + 关闭弹框

export default {
  name: 'DepartmentIndex',
  components: {
    addDepartment
  },
  data() {
    return {
      // 树形数组
      list: [{
        name: '财务部',
        manager: '张三',
        children: [
          {
            name: '财务核算部',
            manager: '李四'
          },
          {
            name: '税务核算部',
            manager: '王五'
          }
        ]
      }],
      // 后端返回的数据字段中如果不是默认的label或者children的时候 可以通过
      // 这个参数进行自定义 它的值就是我们要识别的字段
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 弹框显示状态
      dialogVisible: false,
      // 用来确定点开的部门的父组件的id是谁
      curId: ''
    }
  },
  // 纠正一下：created和mounted发送请求并无实际区别 这个时间差和异步接口发送到返回的事件差相比
  // 可以忽略不计 所以不要出现 created优于mounted 谈不上性能优化
  mounted() {
    this.fetchDepartments()
  },
  methods: {
    async fetchDepartments() {
      // 发送接口请求
      const { depts } = await getDepartments()
      // 问题：后端返回的是扁平的数组 但是我们组件需要的是树形的结构
      // 数据处理  扁平化 -> 树形结构  先处理再赋值
      this.list = transTree(depts)
    },
    // 新增部门
    addDepartment(id) {
      // 打开弹框
      this.dialogVisible = true
      // console.log(id)
      // 重置获取的id值
      this.curId = id
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 重置刷新表单
    resetData() {
      // 1. 更新列表
      // 2. 更新curId
      this.fetchDepartments()
      this.curId = ''
    },
    // 修改部门
    editDepartment(id) {
      // 1. 打开弹框
      this.dialogVisible = true
      // 2. 调用接口 拉取详情数据
      // 直接调用子组件中的getDetail方法
      // 并且传递id参数
      // this.$refs.xxx 放在组件身上 -> 组件实例对象  如果放到标签身上 -> dom
      this.$refs.addDepart.getDetail(id)
    },
    // 调用子组件的根据id删除部门
    removeDepartment(id) {
      this.$refs.addDepart.removeDepart(id)
    }
  }
}
</script>
