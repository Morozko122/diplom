# from flask import Flask, request, jsonify
# from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, login_required
# from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
# from flask_sqlalchemy import SQLAlchemy

# app = Flask(__name__)
# app.config["SECRET_KEY"] = "secret_key_here"

# db = SQLAlchemy(app)

# class User(UserMixin, db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(100), unique=True)
#     password = db.Column(db.String(100))
#     active = db.Column(db.Boolean())
#     roles = db.relationship("Role", secondary="user_roles", backref=db.backref("users", lazy="dynamic"))

# class Role(RoleMixin, db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(100), unique=True)
#     description = db.Column(db.String(100))

# user_datastore = SQLAlchemyUserDatastore(db, User, Role)
# security = Security(app, user_datastore)

# jwt = JWTManager(app)

# @app.route("/logins", methods=["POST"])
# def login():
#     email = request.json.get("email")
#     password = request.json.get("password")
#     user = user_datastore.get_user(email)
#     if user and user.authenticate(password):
#         access_token = create_access_token(identity=email)
#         return {"access_token": access_token}
#     return {"error": "Invalid credentials"}, 401

# @app.route("/protected", methods=["GET"])
# @jwt_required
# def protected():
#     user_id = get_jwt_identity()
#     user = user_datastore.get_user(user_id)
#     if user.has_role("admin"):
#         return {"message": "Hello, admin!"}
#     return {"message": "Hello, user!"}

