import os
from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from flask_security import Security, current_user, hash_password, SQLAlchemySessionUserDatastore
from app.database import db_session, init_db
from app.models import User, Role


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
ANNOTATIONS_FOLDER = os.path.join(os.getcwd(), 'annotations')
if not os.path.exists(ANNOTATIONS_FOLDER):
    os.makedirs(ANNOTATIONS_FOLDER)
TEST_FOLDER = os.path.join(os.getcwd(), 'test')
if not os.path.exists(TEST_FOLDER):
    os.makedirs(TEST_FOLDER)
    

user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
app.security = Security(app, user_datastore)

app.teardown_appcontext(lambda exc: db_session.close())

with app.app_context():
    init_db()
    # Create a user and role to test with
    app.security.datastore.find_or_create_role(
        name="admin", permissions={"admin-read", "admin-write"}
    )
    app.security.datastore.find_or_create_role(
        name="methodologist", permissions={"admin-read", "admin-write"}
    )
    app.security.datastore.find_or_create_role(
        name="hostel-employee", permissions={"admin-read", "admin-write"}
    )
    app.security.datastore.find_or_create_role(
        name="student", permissions={"admin-read", "admin-write"}
    )
    db_session.commit()
    if not app.security.datastore.find_user(email="xeui@cm.cd"):
        app.security.datastore.create_user(email="xeui@cm.cd",
        password=hash_password("password"), roles=["admin"])
    db_session.commit()
    
from app import routes