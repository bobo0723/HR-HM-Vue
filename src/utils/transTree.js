// 树形处理
// 1. 确定函数的参数和返回值
// 参数？ 后端直接给到我们的扁平化的数组
// 返回值？ 经过处理之后的树形的数组

// 2. 转化思路分析 [固定的逻辑 寻找父节点的过程]
// 如果当前项的pid字段和某项的id字段相等 那当前项就是某项的子节点
// 整个过程就是一个遍历寻找父节点的过程 找到之后把自己添加到父节点的chilren属性中

// 3. 代码的实现流程 [固定的]
// 1. 遍历整个list 以每一项的id作为key，以每一项自身作为value形成一个对象结构
// 2. 遍历整个list 以当前项的pid去和第一步中的对象里的id匹配 匹配上就添加到他的children属性里
// 如果没有发生匹配 则代表自己本身就是最外层的父亲节点 添加到最终产出的targetList中

// 讨巧hack的方案：用了js引用数据类型的特性 就是引用的内存一旦变化 所有引用的地方都会一起变

function transTree(list) {
  const targetList = []
  // 形成map对象结构 目的是为查找方便
  const map = {}
  list.forEach((item) => {
    map[item.id] = item
    item.children = []
  })
  // 查找 寻找自己的父节点
  list.forEach((item) => {
    if (map[item.pid]) {
      // 找到了
      map[item.pid].children.push(item)
    } else {
      // 没找到
      targetList.push(item)
    }
  })
  // 转化逻辑
  return targetList
}

export default transTree
