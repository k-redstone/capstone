const mysql = require('mysql');

const db_info = {
  host: '222.113.91.56',
  port: '3306',
  user: 'capstone',
  password: 'root',
  database: 'python'
}

module.exports = {
  init: function () {
    return mysql.createConnection(db_info)
  },
  connect: function(conn) {
    conn.connect(function(error) {
      if(error) {
        console.error('connection error :' + error)
      } else {
        console.log('connection Successfully!')
      }
    })
  }
}