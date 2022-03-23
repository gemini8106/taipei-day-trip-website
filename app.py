from flask import *
from views.api import app_api


app=Flask(__name__,
  static_folder="static",   #資料夾名static
  static_url_path="/static"   #資料夾路徑"/static"
  )
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["JSON_SORT_KEYS"]= False    #讓json不會依字母排列
app.debug= True
app.register_blueprint(app_api)
app.secret_key = "bvipfhqifnjvbnklhf"



# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")





    
app.run(host='0.0.0.0',port=3000)