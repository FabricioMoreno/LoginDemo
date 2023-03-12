from flask import Flask,request,jsonify,abort
from flask_cors import CORS,cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

""" Authorization JWT """
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

import jwt
from functools import wraps


from werkzeug.exceptions import *
from werkzeug.security import generate_password_hash, check_password_hash



app = Flask(__name__)
cors = CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:3ZNrsKIBBxmqIpZ7nQt2@containers-us-west-167.railway.app:7780/railway"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['CORS_HEADERS'] = 'Content-Type'

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)

API_BASE_URL = "/api/v1"

""" 
------------------MODEL DB------------------ 
"""

class User(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    username= db.Column(db.String(50),nullable=False,unique=True)
    password = db.Column(db.String(200),nullable=False)
    products = db.relationship("Product",backref = "user")

    def __init__(self,username,password):
        self.username = username
        self.password = generate_password_hash(password)

class Product(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name= db.Column(db.String(50),nullable=False,unique=True)
    description = db.Column(db.String(200),nullable=False)
    price = db.Column(db.Float,nullable=False)
    created_by = db.Column(db.Integer,db.ForeignKey("user.id"))


    def __init__(self,username,password):
        self.username = username
        self.password = generate_password_hash(password)


with app.app_context():
    db.create_all()

""" 
------------------SCHEMA DB------------------
"""

class UserSchema(ma.Schema):
    class Meta:
        fields=("id","username","password")
user_schema = UserSchema()
users_schema = UserSchema(many=True)

class ProductSchema(ma.Schema):
    class Meta:
        fields=("id","name","description","price","created_by")
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

""" 
------------------ROUTING------------------
"""

""" 
            /auth controllers
"""

@app.route(API_BASE_URL+"/auth/register",methods=["POST"])
def registerUser():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if(username == "" or password == "" or not username or not password):
        raise(400)

    new_user = User(username,password)
    db.session.add(new_user)
    db.session.commit()

    new_user = user_schema.dump(new_user)

    access_token = create_access_token(identity=username )

    return jsonify({"user":{
        "id":new_user["id"],
        "username":new_user["username"]
    },"access_token":access_token}),201
  

def check_password(password,passwordToCompare):
        print(password)
        return check_password_hash(password,passwordToCompare)

@app.route(API_BASE_URL+"/auth/login",methods=["GET","POST"])
@cross_origin()
def loginUser():
    print(request)
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    print(username)

    user = User.query.filter_by(username = username)
    result = users_schema.dump(user)[0]

    if not result:
        raise Unauthorized()
    

    is_password_correct = check_password(str(result["password"]),password)

    if not is_password_correct:
        raise Unauthorized()

    access_token = create_access_token(identity=username)

    return jsonify({"user":{
        "id":result["id"],
        "username":result["username"]
    },"access_token":access_token}),201


""" 
            /products controllers
"""
@app.route(API_BASE_URL+"/products",methods=["GET","POST"])
@cross_origin()
@jwt_required()
def getAllProducts():
    print(request.json)
    user_req = request.json.get("user", None)
    user = Product.query.filter_by(created_by=user_req["id"])

    result = products_schema.dump(user)
    
    return jsonify({"products":result}),200


""" 
---------------HANDLING ERRORS--------------
"""
@app.errorhandler(400)
def bad_request(e):
    return jsonify({"msg":"Bad request"}), 400

@app.errorhandler(NotFound)
def not_found_request(e):
    return jsonify({"msg":"Not found"}), 400

@app.errorhandler(Forbidden)
def handle_forbidden_request(e):
    return jsonify({"msg":"No credenitials provided"}), 403

@app.errorhandler(Unauthorized)
def handle_unauthorized_request(e):
    return jsonify({"msg":"No permissions"}), 401

@app.errorhandler(InternalServerError)
def handle_internalServerError_request(e):
    return jsonify({"msg":"Internal server error"}), 500



""" 
------------------MAIN SCRIPT------------------
"""
if __name__ ==  "__main__":
    print("here")

    app.run(debug=True)

