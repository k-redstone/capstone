const db_config = require("./sql.js");
const conn = db_config.init()


function test() {
  const text = "일본 교환학생 내년 2학기에 일본교환학생 생각하고 있는데<br />혹시 도시샤 교환학생 다녀오신 분에게 여쭤보고 싶은게 있어요<br />쪽지 주시면 감사하겠습니다...!"
  const res = text.replace(/<br \/>/g, " ")
  console.log(res)
}


function select() {
  let sql = `select convert(time, time) from article where id=239993866`;
  conn.query(sql, function(error, rows, fields) {
    if(error) {
      console.log('query failed: ' + error)
    }else{
      console.log(rows)
      console.log("finish")
      conn.end()
    }
  })
  }


  function time() {
    const a = "2022-03-16 17:36:05"
    const b = "2022-03-15 17:44:18"

    if(a > b) {
      console.log("confirm")
    }
  }

  function f(num) {
    for (let i = 1, j=1; j <= num; i += 20, j++) {
      console.log(i, j)
    }}

f(3)