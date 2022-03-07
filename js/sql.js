const mysql = require('mysql');

const db_info = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'capstone'
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