from datetime import datetime
import os

class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:123321123@localhost:5432/tiudb"
    CORS_HEADERS = 'Content-Type'
    DEBUG = True
    WTF_CSRF_ENABLED = False
    SECRET_KEY = os.environ.get("SECRET_KEY", 'pf9Wkove4IKEAXvy-cQkeDPhv9Cb3Ag-wyJILbq_dFw')
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT", '146585145368132386173505678016728509634')
    SECURITY_EMAIL_VALIDATOR_ARGS = {"check_deliverability": False}
    JWT_SECRET_KEY = "super-secret"