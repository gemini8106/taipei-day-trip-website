from mysql.connector import pooling
connection_pool= pooling.MySQLConnectionPool(
  pool_name= "traveldb_pool",
  pool_size= 5,
  pool_reset_session= True,
  host= "localhost",
  user= "root",
  password= "qwer1234",
  database= "travel"
)