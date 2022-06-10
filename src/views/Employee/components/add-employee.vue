<template>
  <div>
    <el-dialog
      title="新增员工"
      width="30%"
      :visible="dialogVisible"
      @close="closeDialog"
      @open="openDialog"
    >
      <!-- 表单 -->
      <template #default>
        <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="入职时间" prop="timeOfEntry">
            <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
          </el-form-item>
          <el-form-item label="聘用形式" prop="formOfEmployment">
            <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
              <el-option
                v-for="item in hireList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
            <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="部门" prop="departmentName">
            <el-cascader
              v-model="formData.departmentName"
              :options="options"
              :props="cascaderProps"
              placeholder="请选择部门"
            />
          </el-form-item>
          <el-form-item label="转正时间" prop="correctionTime">
            <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from '@/api/department.js'
import { addEmployee } from '@/api/employee'
import transTree from '@/utils/transTree'
export default {
  props: {
    dialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      // 表单数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      // 聘用形式的枚举转化
      hireList: [
        {
          id: 1,
          name: '正式'
        },
        {
          id: 2,
          name: '非正式'
        }
      ],
      // 级联选择器的渲染数据
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }]
        }]
      }],
      // 级联选择器的参数接受值
      cascaderProps: {
        value: 'name',
        label: 'name',
        checkStrictly: true
      }
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      // 重置校验结果
      this.$refs.addForm.resetFields()
      // 关闭弹窗
      this.$emit('close-dialog')
    },
    // 打开弹窗
    async openDialog() {
      // 获取部门信息
      const res = await getDepartments()
      // console.log(res)
      // 扁平化部门信息数据 树形格式化
      this.options = transTree(res.depts)
    },
    // 确认提交
    confirm() {
      // 兜底校验
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          await addEmployee({
            ...this.formData,
            departmentName: this.formData.departmentName[this.formData.departmentName.length - 1]
          })
          this.$message.success('添加成功')
          // 刷新列表
          this.$emit('fetch-tableList')
          // 关闭弹窗
          this.closeDialog()
        }
      })
    }
  }
}
</script>

<style>

</style>
