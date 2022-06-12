const list = [
  { name: '张三', age: 18, sex: 1 },
  { name: '李四', age: 8, sex: 0 },
  { name: '王五', age: 28, sex: 1 }
]
function render(list, arr) {
  // console.log(arr)

  const newList = []
  const newArr = []
  list.map((item) => {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      const em = arr[i]
      // console.log(em)
      list.push(item[em])
    }
    // console.log(list)
    newArr.push(list)
    newList.push(Object.values(item))
  })
  console.log('----')
  // console.log(newList)
  console.log(newArr)
  return newList
}
// render(list, ['name', 'age'])
render(list, ['name', 'age', 'sex'])
