import request from '@/utils/request'

/**
 * @description: 获取下拉员工数据
 * @param {*}
 * @return {*}
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * @description: 获取员工列表
 * @param {*} params {page:当前页,size: 每页条数}
 * @return {*}
 */
export function getEmployeeList(params) {
  return request({
    methods: 'get',
    url: '/sys/user',
    params
  })
}

/**
 * @description: 删除员工
 * @param {*} id 员工id
 * @return {*}
 */
export function delEmployee(id) {
  return request({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 添加员工
 * @param {*} data
 * @return {*}
 */
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * @description: 从excel中批量导入员工数据
 * @param {*} data
    [{
      mobile: 15751786320
      timeOfEntry: "2019-03-09T16:00:00.000Z"
     	username: "测试人员1"
     	workNumber: 88088,
     	formOfEmployment: 0,
     	departmentName: "技术部"
    }]
 * @return {*}
 */
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * @description: 获取用某个员工的信息
 * @param {*} id
 * @return {*}
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @description: 为用户分配角色
 * @param {*} data { id:当前用户id, roleIds:选中的角色id组成的数组 }
 * @return {*}
 */
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
