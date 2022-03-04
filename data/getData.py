import json
import mysql.connector

travel_db= mysql.connector.connect(
  host= "localhost",
  user= "root",
  password= "qwer1234",
  database= "travel"
)


with open("taipei-attractions.json","r") as file:
  data= json.load(file)   #data為dict資料

attraction_list= data["result"]["results"]
cursor= travel_db.cursor()

for attraction in attraction_list:
  id= attraction_list.index(attraction)+1
  cursor.execute("INSERT INTO attractions(name, category, description, address, transport, mrt, latitude, longitude) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)",(attraction["stitle"], attraction["CAT2"], attraction["xbody"], attraction["address"], attraction["info"], attraction["MRT"], attraction["latitude"], attraction["longitude"]))
  link = attraction["file"].replace("JPG","jpg")
  url= link.replace("http"," http").split()  #將http加上空格，split會找空格切
  url_list= []
  for url_1 in url:
    if "jpg" in url_1 or "png" in url_1:
      url_list.append(url_1)
  url_list= ",".join(url_list)              #將list轉為字串型態
  cursor.execute("INSERT INTO attractions(id, images) VALUES(%s, %s) ON DUPLICATE KEY UPDATE images= %s;",(id, url_list, url_list))   #insert 跟 where不可一起使用，需用此方法，可查stack overflow
  
travel_db.commit()
cursor.close()
