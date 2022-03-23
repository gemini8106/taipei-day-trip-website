from flask import *
app_api= Blueprint("app_api", __name__)
from views.database import connection_pool




@app_api.route("/api/attractions", methods= ["GET"])
def attractions():
  page= request.args.get("page")
  keyword= request.args.get("keyword")

  start_number= int(page)*12
  end_number= int(page)*12+12
 
  if keyword:
    travel_db= connection_pool.get_connection()
    cursor= travel_db.cursor()
    cursor.execute("SELECT * FROM attractions WHERE name LIKE concat('%', %s,'%') LIMIT %s,13 ",(keyword, start_number))
    attractions= cursor.fetchall()
    cursor.close()
    travel_db.close()
    
    if not attractions:
      return jsonify({"nextpage":None,
                    "data":None})
    elif attractions:
      attraction_list= []
      for attraction in attractions:
        information= {
          "id": attraction[0],
          "name": attraction[1],
          "category": attraction[2],
          "description": attraction[3],
          "address": attraction[4],
          "transport":attraction[5],
          "mrt": attraction[6],
          "latitude": attraction[7],
          "longitude": attraction[8],
          "images": attraction[9].split(",")					#取到的值為字串形式，用split在"，"切開，切開後自動轉為list
        }
        attraction_list.append(information)
      #抓到>12筆資料且總資料量減掉尾數<0代表最末頁，次頁顯示為none
      if len(attractions)> 12 and len(attractions)- end_number<0:       
        return	jsonify({"nextpage":None,
                      "data":attraction_list[start_number: end_number]})
    
      #抓到>12筆資料且總資料量減掉尾數>0代表有次頁
      elif len(attractions)> 12 and len(attractions)- end_number>0:
        return	jsonify({"nextpage":int(page)+1,
                      "data":attraction_list[start_number: end_number]})
      elif len(attractions)<= 12:
        return jsonify({"nextpage":None,
                      "data":attraction_list})
      else:
        return make_response(jsonify({"error": True, 
                      "message": "伺服器內部錯誤"}), 500)
  else:
    travel_db= connection_pool.get_connection()
    cursor= travel_db.cursor()
    #沒有keyword的情況，一頁以limit取12筆資料
    cursor.execute("SELECT * FROM attractions LIMIT %s,12 ",(start_number,))
    page_attractions= cursor.fetchall()
    # print(page_attractions[11][0])
	
		#取資料庫id總數
    cursor.execute("SELECT count(*) FROM attractions WHERE id")
    total_number= cursor.fetchone()[0]
    cursor.close()
    travel_db.close()
    # print(total_number)

    page_attraction_list= []
    for page_attraction in page_attractions:
      information= {
        "id": page_attraction[0],
        "name": page_attraction[1],
        "category": page_attraction[2],
        "description": page_attraction[3],
        "address": page_attraction[4],
        "transport":page_attraction[5],
        "mrt": page_attraction[6],
        "latitude": page_attraction[7],
        "longitude": page_attraction[8],
        "images": page_attraction[9].split(",")
      }
      page_attraction_list.append(information)

		#如果取到12筆且總數不為12倍數，表示有下一頁
    if len(page_attractions)== 12 and total_number/12 != 0:
      return jsonify({"nextpage":int(page)+1,
                    "data":page_attraction_list})

    #如果取到12筆且最後一筆id=id總數，表示沒有下一頁
    elif len(page_attractions)== 12 and page_attractions[11][0]== total_number:
      return jsonify({"nextpage":None,
                    "data":page_attraction_list})
    elif len(page_attractions)< 12:
      return jsonify({"nextpage":None,
                    "data":page_attraction_list})
    else:
      return make_response(jsonify({"error": True, 
                    "message": "伺服器內部錯誤"}), 500)




@app_api.route("/api/attraction/<variable>", methods= ["GET"])
def attraction(variable):
  travel_db= connection_pool.get_connection()
  cursor= travel_db.cursor()
  cursor.execute("SELECT * FROM attractions WHERE id= %s", (variable,))
  scenery= cursor.fetchone()
  cursor.close()
  travel_db.close()
  if scenery:
    return jsonify({"data": {
			"id": scenery[0],
			"name": scenery[1],
			"category": scenery[2],
			"description": scenery[3],
			"address": scenery[4],
			"transport": scenery[5],
			"mrt": scenery[6],
			"latitude": scenery[7],
			"longitude": scenery[8],
			"images": scenery[9].split(",")

		}})
  elif scenery== None:
    return make_response(jsonify({"error": True, 
                    "message": "景點編號不正確"}), 400)
  else:
    return make_response(jsonify({"error": True, 
                    "message": "伺服器內部錯誤"}), 500)




@app_api.route("/api/user", methods = [ "POST"])
def signup():
  new_user_data = request.get_json()
  name = new_user_data["name"]
  email = new_user_data["email"]
  password = new_user_data["password"]
  member_db = connection_pool.get_connection()
  cursor = member_db.cursor()
  cursor.execute("SELECT * FROM member WHERE email= %s",(email,))      
  check_email = cursor.fetchone()
  cursor.close()
  member_db.close()

  if name == "" or email == "" or password == "":
    return make_response(jsonify({"error": True, 
                  "message":"請輸入完整資訊"}), 400)
  elif check_email :
    return make_response(jsonify({"error": True, 
                  "message":"Email已經被註冊"}), 400)
  elif name != "" or email != "" or password != "" and check_email != None :
    member_db = connection_pool.get_connection()
    cursor = member_db.cursor()
    cursor.execute("INSERT INTO member(name, email, password) VALUES(%s, %s, %s)",(name, email, password,))
    member_db.commit()
    cursor.close()
    member_db.close()
    return make_response(jsonify({"ok":True}), 200)
  else:
    return make_response(jsonify({"error": True, 
                  "message": "伺服器內部錯誤"}), 500)
      

@app_api.route("/api/user", methods = ["PATCH"])
def signin():
  user_data = request.get_json()
  email = user_data["email"]
  password = user_data["password"]
  member_db = connection_pool.get_connection()
  cursor= member_db.cursor()
  cursor.execute("SELECT * FROM member WHERE email= %s AND password= %s",(email, password,))
  checkUser = cursor.fetchone()
  cursor.close()
  member_db.close()
  if checkUser:
    session["id"] = checkUser[0]
    session["name"] = checkUser[1]
    session["email"] = checkUser[2]
    return make_response(jsonify({"ok":True}), 200)
  elif checkUser == None:
    return make_response(jsonify({"error": True, 
                  "message":"帳號或密碼輸入錯誤"}), 400)
  else:
    return make_response(jsonify({"error": True, 
                  "message": "伺服器內部錯誤"}), 500)


@app_api.route("/api/user", methods= ["GET"])
def is_member():
  if "email" in session:
    return make_response(jsonify({
      "data" : {"id" : session["id"], 
                "name" : session["name"], 
                "email" : session["email"]}}), 200)
  else:
    return make_response(jsonify({"data":None}))
  
@app_api.route("/api/user", methods= ["DELETE"])
def signout():
  session.pop("id", None)
  session.pop("name",None)      
  session.pop("email",None)
  return make_response(jsonify({"ok":True}))

    
    