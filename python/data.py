import sql_config

sql = "select * from article where content"

sql_config.execute(sql, "true")