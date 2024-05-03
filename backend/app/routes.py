from app import app
from flask import Flask, jsonify, request
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,get_jwt
from app.decorator import roles_required 

@app.route("/hello", methods=["GET"])
def hell():
     return {'hi': 'Hello 1223!'}
 
@app.route("/user")
@auth_required()
@permissions_accepted("user-read")
def user_home():
    return render_template_string("Hello {{ current_user.email }} you are a user!")


jwt = JWTManager(app)

@app.route('/login_user', methods=['POST'])
def login():    
   print(request.json)
   username = request.json.get('username', None)
   password = request.json.get('password', None)

   user = app.security.datastore.find_user(username=username)
   
   if user and user.password == password:
       access_token = create_access_token(identity=user.username,  additional_claims={"role": "adddmin"})
       return jsonify(access_token=access_token), 200
   else:
       return jsonify({"msg": "Invalid username or password"}), 401


@app.route('/admin1', methods=['GET'])
@roles_required(*['admin', 'adddmin'])
def admin_only():
   current_user = get_jwt_identity()
   print(current_user)
   claims = get_jwt()
  
   return jsonify({'message': f'This is an admin-only endpoint. Hello, {claims["role"]}!'})