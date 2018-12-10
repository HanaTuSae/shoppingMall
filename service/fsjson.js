const fs = require('fs')
fs.readFile('./goods.json', 'utf8', (err, data) => {
  if (err) {
    throw err
  }
  let pushData = []
  let newData = JSON.parse(data)
  let i = 0
  newData.RECORDS.map((value, index) => {
    if (value.IMAGE1 != null) {
      i++
      // console.log(value.NAME)
      pushData.push(value)
    }
  })
  console.log(i)
  let newPushData = JSON.stringify(pushData)
  fs.writeFile('./newGoods.json', newPushData, function (err) {
    if (err) {
      console.log('写文件操作失败')
      throw err
    }
    console.log('写文件操作成功')
  })
  // console.log(pushData)
})
