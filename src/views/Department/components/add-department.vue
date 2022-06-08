<template>
  <el-dialog

    title="提示"
    :visible="showDialog"
    width="30%"
    @close="closeDialog"
    @open="openDialog"
  >
    <!-- 默认插槽 主题内容部分 -->
    <template #default>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <!-- label:文案  value:选中哪个哪个的value会被自动绑定到select v-model后面的属性上 一般和后端交互 提交给后端 -->
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" />
        </el-form-item>
      </el-form>
    </template>
    <!-- 具名插槽 按钮操作区域 -->
    <template #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employee'
import { addDepartments, getDepartDetail, updateDepartments, delDepartments } from '@/api/department'
// 这个下拉框内的数据在什么请求？ 弹框出现之后才有可能使用这个数据 弹框打开的时候才发送请求
export default {
  // props传入的数据可以直接修改吗？ readonly 单项数据流 通过自定义事件修改父组件中的数据 emit
  props: {
    showDialog: {
      type: Boolean
    },
    curId: {
      type: String,
      default: '' // 默认值 传入数据就以传入的为主 不传就是默认值
    }
  },
  data() {
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }, // 这里的属性名称有要求 应该接口字段名是啥
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      managerList: [] // 负责人列表
    }
  },
  methods: {
    // 关闭弹窗时
    closeDialog() {
      // console.log('弹框关闭了')
      // 重置表单和验证规则
      this.$refs.form.resetFields()
      // 通过子传父的方式 把showDialog改成false
      this.$emit('close-dialog')
    },
    // 打开弹窗时
    async openDialog() {
      // console.log('弹框打开了')
      // 发送请求获取负责人列表数据
      const res = await getEmployeeSimple()
      // 赋值到负责人列表
      this.managerList = res
    },
    confirm() {
      // 1.兜底校验
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 这里大量的逻辑是可以和新增复用的 只需要在这里调用更新接口
          // 原来的新增逻辑依旧需要保持 做判断 判断当前到底应该更新还是新增
          // 找到一个判断的一句条件？ id
          // 2.提交接口
          if (this.form.id) {
            // 更新接口
            await updateDepartments(this.form)
          } else {
            // 新增接口
            await addDepartments({
              ...this.form,
              pid: this.curId// 父组件中点击谁就要获取到谁的id  获取到的位置是父组件 使用它的位置是子组件
            })
          }
          // 后续逻辑操作
          // 1. 更新列表 子传父
          this.$emit('reset-data')
          // 2. 弹框关闭
          this.$emit('close-dialog')
          // 3. 提示用户
          this.$message.success(`${this.form.id ? '更新成功' : '新增成功'}`)
          // 4. 数据清空重置
          this.$refs.form.resetFields()
        }
      })
    },
    // 获取部门详情
    async getDetail(id) {
      // id在父组件 使用在子组件？
      // 获取部门详情信息，返回值res的对象中包含id字段
      const res = await getDepartDetail(id)
      // 回填表单数据
      this.form = res
    },
    // 根据id删除部门
    removeDepart(id) {
      // console.log(id)
      // 询问用户是否确认删除
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 调用删除接口
        await delDepartments(id)
        // 重新获取，刷新表单
        this.$emit('fetch-departments')
        // 提示用户删除部门成功
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 取消
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
