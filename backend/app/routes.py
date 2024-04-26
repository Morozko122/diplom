from app import app
from flask_cors import cross_origin
from flask import jsonify, render_template
from flask import render_template_string
from flask_security import auth_required, permissions_accepted, current_user

@app.route("/hello")
def hell():
    return 'Hello 123!'
@app.route("/")
@auth_required()
def home():
    return render_template_string('Hello {{current_user.email}}!')

@app.route("/user")
@auth_required()
@permissions_accepted("user-read")
def user_home():
    return render_template_string("Hello {{ current_user.email }} you are a user!")
