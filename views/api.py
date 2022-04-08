from urllib import response
from flask import *
app_api= Blueprint("app_api", __name__)
from views.database import connection_pool
import time
import requests



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
    cursor.close()
    travel_db.close()
    # print(page_attractions[11][0])
    travel_db= connection_pool.get_connection()
    cursor= travel_db.cursor()
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
    return make_response(jsonify({"ok" : True}), 200)
  elif checkUser == None:
    return make_response(jsonify({"error" : True, 
                  "message":"帳號或密碼輸入錯誤"}), 400)
  else:
    return make_response(jsonify({"error" : True, 
                  "message": "伺服器內部錯誤"}), 500)


@app_api.route("/api/user", methods= ["GET"])
def is_member():
  if "email" in session:
    return make_response(jsonify({
      "data" : {"id" : session["id"], 
                "name" : session["name"], 
                "email" : session["email"]}}), 200)
  else:
    return make_response(jsonify({"data": None}))
  
@app_api.route("/api/user", methods= ["DELETE"])
def signout():
  session.pop("id", None)
  session.pop("name",None)      
  session.pop("email",None)
  return make_response(jsonify({"ok" : True}))


#booking api   
@app_api.route("/api/booking" , methods = ["POST"])
def new_booking() :
  name = session["name"]
  email = session["email"]
  new_booking_data = request.get_json()
  attractionId = new_booking_data["attractionId"]
  date = new_booking_data["date"]
  time = new_booking_data["time"]
  price = new_booking_data["price"]
  if "email" in session:
    booking_db = connection_pool.get_connection()
    cursor = booking_db.cursor()
    cursor.execute("INSERT INTO booking(name , email , attractionId , date , time , price) VALUES(%s , %s , %s , %s , %s , %s)",(name , email , attractionId , date , time , price))
    booking_db.commit()
    cursor.close()
    booking_db.close()
    return make_response(jsonify({"ok" : True}), 200)
  elif "email" not in session:
    return make_response(jsonify({"error" : True
                                  ,"message" : "使用者未登入"}), 403)
  elif new_booking_data == None:
    return make_response(jsonify({"error" : True
                                  ,"message" : "輸入錯誤"}), 400)
  else:
    return make_response(jsonify({"error" : True
                                  ,"message" : "伺服器內部錯誤"}), 500)

@app_api.route("/api/booking" , methods = ["GET"])
def booking() :
  if "email" not in session:
    return make_response(jsonify({"error" : True
                                  ,"message" : "使用者未登入"}), 403)
  else :
    booking_db = connection_pool.get_connection()
    cursor = booking_db.cursor()
    cursor.execute("SELECT * FROM booking WHERE email = %s", (session["email"],))
    check_attractionId = cursor.fetchone()
    cursor.close()
    booking_db.close()
    if check_attractionId == None :
      return make_response(jsonify({
        "data" : None}))
    else :
      attractionId = check_attractionId[3]
      booking_db = connection_pool.get_connection()
      cursor = booking_db.cursor()
      cursor.execute("SELECT * FROM attractions WHERE id = %s", (attractionId,))
      check_attraction = cursor.fetchone()
      cursor.close()
      booking_db.close()
      return make_response(jsonify({
      "data": {
        "attraction": {
          "id": check_attraction[0],
          "name": check_attraction[1],
          "address": check_attraction[4],
          "image": check_attraction[9].split(",")[0]
        },
        "date": check_attractionId[4],
        "time": check_attractionId[5],
        "price": check_attractionId[6]
      }
      }), 200)

@app_api.route("/api/booking" , methods = ["DELETE"])
def delete() :
  if "email" not in session:
    return make_response(jsonify({"error" : True
                                ,"message" : "使用者未登入"}), 403)
  else :
    booking_db = connection_pool.get_connection()
    cursor = booking_db.cursor()
    cursor.execute("DELETE FROM booking WHERE email = %s", (session["email"],))
    booking_db.commit()
    cursor.close()
    booking_db.close()
    return make_response(jsonify({"ok" : True}))
  
  
#unique order number
def get_order_code():
  order_umber = str(time.strftime('%Y%m%d%H%M%S' , time.localtime(time.time())) + str(time.time()).replace('.' , '')[-5:])
  return order_umber


  

@app_api.route("/api/orders" , methods = ["POST"])
def orders() :
  order_data = request.get_json()
  order_number = get_order_code()
  prime = order_data["prime"]
  price = order_data["order"]["price"]
  attraction_id = order_data["order"]["trip"]["attraction"]["id"]
  attraction_name = order_data["order"]["trip"]["attraction"]["name"]
  attraction_address = order_data["order"]["trip"]["attraction"]["address"]
  attraction_image = order_data["order"]["trip"]["attraction"]["image"]
  date = order_data["order"]["trip"]["date"]
  time = order_data["order"]["trip"]["time"]
  contact_name = order_data["order"]["contact"]["name"]
  contact_email = order_data["order"]["contact"]["email"]
  contact_phone = order_data["order"]["contact"]["phone"]
  order_db = connection_pool.get_connection()
  cursor = order_db.cursor()
  cursor.execute("INSERT INTO order_list(order_number , price , attraction_id , attraction_name , attraction_address , attraction_image , date , time , contact_name , contact_email , contact_phone) VALUES(%s , %s , %s , %s , %s , %s , %s , %s , %s , %s , %s)",(order_number , price , attraction_id , attraction_name , attraction_address , attraction_image , date , time , contact_name , contact_email , contact_phone))
  order_db.commit()
  cursor.close()
  order_db.close()
  header = {"Content-Type": "application/json",
             "x-api-key" : "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM"}
  pay_data =  {"prime" : prime,
              "partner_key" : "partner_6ID1DoDlaPrfHw6HBZsULfTYtDmWs0q0ZZGKMBpp4YICWBxgK97eK3RM",
              "merchant_id" : "GlobalTesting_CTBC",
              "amount" : price,
              "details" : "taipei-day-trip",
              "cardholder" : {
                "phone_number" : contact_phone,
                "name" : contact_name,
                "email" : contact_email,
              }}
  if "email" not in session:
    return make_response(jsonify({"error" : True
                                ,"message" : "使用者未登入"}), 403)
  else:
    if prime:
      response = requests.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
      headers = header,
      json = pay_data
      )
      print(response.json())
      if response.json()["status"] == 0 :
        order_db = connection_pool.get_connection()
        cursor = order_db.cursor()
        cursor.execute("UPDATE order_list SET status = 0 WHERE order_number = %s" , (order_number , ))
        order_db.commit()
        cursor.close()
        order_db.close()
        return make_response(jsonify({
          "data" : {
            "number" : order_number,
            "payment" : {
              "status" : 0,
              "message" : "付款成功"
            }
          }}),200)
      else :
        return make_response(jsonify({
          "data" : {
            "number" : order_number,
            "payment" : {
              "status" : 1,
              "message" : "付款失敗"
            }
          }}),200)
    elif not prime : 
      return make_response(jsonify({"error" : True
                                  ,"message" : "未取得prime"}), 400)
    else : 
      return make_response(jsonify({"error" : True
                                  ,"message" : "伺服器內部錯誤"}), 500)


@app_api.route("/api/order/<order_number>")
def order(order_number) :
  if "email" not in session:
    return make_response(jsonify({"error" : True
                                ,"message" : "使用者未登入"}), 403)
  else :
    order_db = connection_pool.get_connection()
    cursor = order_db.cursor()
    cursor.execute("SELECT * FROM order_list WHERE order_number = %s AND contact_email = %s" , (order_number , session["email"]))
    order = cursor.fetchone()
    cursor.close()
    order_db.close()
    if not order:
      return make_response(jsonify({
        "data" : None
      }),200)
    else :
      return make_response(jsonify({
        "data" : {
          "number" : order[1],
          "price" : order[2],
          "trip" : {
            "attraction" : {
              "id" : order[3],
              "name" : order[4],
              "address" : order[5],
              "image" : order[6],
            },
            "date" : order[7],
            "time" : order[8],
          },
          "contact" : {
            "name" : order[9],
            "email" : order[10],
            "phone" : order[11],
          },
          "status" : order[12]
      }}),200)
      

  
    

      
      
      
    
  
  

 
