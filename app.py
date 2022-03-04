from tracemalloc import start
from flask import *
import mysql.connector


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.config["JSON_SORT_KEYS"]= False

app.debug= False

travel_db= mysql.connector.connect(
  host= "localhost",
  user= "root",
  password= "qwer1234",
  database= "travel"
)



# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/scenery/<id>")
def scenery(id):
	return render_template("scenery.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")





@app.route("/api/attractions", methods= ["GET"])
def attractions():
	page= request.args.get("page")
	keyword= request.args.get("keyword")

	start_number= int(page)*12
	end_number= int(page)*12+12
 
	cursor= travel_db.cursor()
 
	if keyword:
		cursor.execute("SELECT * FROM attractions WHERE name LIKE concat('%',%s,'%')",(keyword,))
		attractions= cursor.fetchall()

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
				"images": attraction[9].split(",")
			}
			attraction_list.append(information)
		if len(attractions)> 12 and len(attractions)- end_number<0:
			return	jsonify({"nextpage":None,
										"data":attraction_list[start_number: end_number]})
		elif len(attractions)> 12 and len(attractions)- end_number>0:
			return	jsonify({"nextpage":int(page)+1,
										"data":attraction_list[start_number: end_number]})
		elif len(attractions)<= 12:
			return jsonify({"nextpage":None,
										"data":attraction_list[start_number: end_number]})
		else:
			return make_response(jsonify({"error": True, 
										"message": "伺服器內部錯誤"}), 500)
	else:
		cursor.execute("SELECT * FROM attractions LIMIT %s,12 ",(start_number,))
		page_attractions= cursor.fetchall()
		# print(page_attractions[11][0])
		cursor.execute("SELECT count(*) FROM attractions WHERE id")
		total_number= cursor.fetchone()[0]
		cursor.close()
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

		
		if len(page_attractions)== 12 and total_number/12 != 0:
			return jsonify({"nextpage":int(page)+1,
										"data":page_attraction_list})
		elif len(page_attractions)== 12 and page_attractions[11][0]== total_number:
			return jsonify({"nextpage":None,
										"data":page_attraction_list})
		elif len(page_attractions)< 12:
			return jsonify({"nextpage":None,
										"data":page_attraction_list})
		else:
			return make_response(jsonify({"error": True, 
										"message": "伺服器內部錯誤"}), 500)




@app.route("/api/attraction/<variable>", methods= ["GET"])
def attraction(variable):
  cursor= travel_db.cursor()
  cursor.execute("SELECT * FROM attractions WHERE id= %s", (variable,))
  scenery= cursor.fetchone()
  cursor.close()
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
    
app.run(host='0.0.0.0',port=3000)