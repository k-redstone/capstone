# pymysql 모듈 필요
# pip install pymysql  or  pip3 install pymysql
import pymysql

# mysql 연결
# db = python
# table = article
# article table구조
# id / time / content
conn = pymysql.connect(host='222.113.91.56', user='capstone', password='root', db='python', charset='utf8')
cursor = conn.cursor()


# sql 실행
def execute(sql):
  cursor.execute(sql)
  # if set == "true":
  #   catchData()
  #   print("sql: insert finish")
  # conn.commit()
  # conn.close()


def catchData():
  res = cursor.fetchall()
  for data in res:
    print(data)


# insert 삽입문
# ex) insert("article", "12312", "2022-03-10 18:50:30", "함수 테스트")
def insert(table, id, time, content):
  sql = "insert into {}(id, time, content) values(%s, %s, %s)".format(table)
  val = (id, time, content)
  cursor.execute(sql,val)
  conn.commit()
  conn.close()
  print("sql: insert finish")




# fetchall -> 모든 정보 불어오기
# fetchon - > 하나의 데이터만 가져옴

# sql = "select * from article"
# cursor.execute(sql)
# res = cursor.fetchall()

# for data in res:
#   print(data)

# conn.commit()
# conn.close()

