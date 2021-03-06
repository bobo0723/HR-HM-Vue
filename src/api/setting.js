import request from '@/utils/request'
/**
 * @description: 获取角色列表
 * @param {*} params:{page 当前页码, pagesize 每页的条数}
 * @return {*} 【人员列表】 total总人数
 */
export function getRoleList(params) {
  return request({
    method: 'get',
    url: '/sys/role',
    params
  })
}

/**
 * @description: 删除角色
 * @param {*} id 角色id
 * @return {*}
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 新增角色
 * @param {*} data {name,description}
 * @return {*}
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

/**
 * @description: 获取角色详情
 * @param {*} id 角色id
 * @return {*}
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * @description: 编辑角色
 * @param {*} data roleForm
 * @return {*}
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

/**
 * @description: 获取角色详情
 * @param {*} data {id:当前角色id}
 * @return {*}
 */
export function getRoleDetailById(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'GET'
  })
}
