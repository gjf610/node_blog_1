const mysql = require('mysql')
const { MYSAL_CONF } = require('../conf/db')

// 创建连接对象
const con = mysql.createConnection(MYSAL_CONF)

// 开始连接
con.connect()

// 统一执行 sql 的函数
function exec(sql){
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if(err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}

module.exports = {
  exec
}

