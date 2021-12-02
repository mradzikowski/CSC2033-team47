import os

from flask import Flask
from flask_restx import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

app = Flask(__name__)

api = Api(app)

# Taking application settings from dockerfile while running
app_settings = os.getenv("APP_SETTINGS")
app.config.from_object(app_settings)

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=func.now())
    # TODO: Add more columns (think about database design)

    def __init__(self, username, email):
        self.username = username
        self.email = email


class Ping(Resource):
    def get(self):
        return {
            "status": "success",
            "message": "pong from the users microservice!",
        }


api.add_resource(Ping, "/ping")
