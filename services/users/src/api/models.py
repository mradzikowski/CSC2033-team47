import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func
from src import db
from werkzeug.security import generate_password_hash


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    twitter_link = db.Column(db.String(256), nullable=True)
    datasets = db.relationship("Dataset", backref="user", lazy=True)
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(self, username="", email="", password="", twitter_link=""):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.twitter_link = twitter_link

    def encode_auth_token(self, user_id, token_type):
        if token_type == "access":
            seconds = current_app.config.get("ACCESS_TOKEN_EXPIRATION")
        else:
            seconds = current_app.config.get("REFRESH_TOKEN_EXPIRATION")

        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=seconds),
            "iat": datetime.datetime.utcnow(),
            "sub": user_id,
        }

        return jwt.encode(
            payload,
            current_app.config.get("SECRET_KEY"),
            algorithm="HS256",
        )

    @staticmethod
    def decode_auth_token(auth_token):
        payload = jwt.decode(
            auth_token,
            current_app.config.get("SECRET_KEY"),
            algorithms="HS256",
        )
        return payload["sub"]


class Dataset(db.Model):
    __tablename__ = "datasets"

    dataset_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # TODO: associate the user_id with the user from the current session
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    file_name = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    file_type = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(self, file_name, title):
        self.file_name = file_name
        self.title = title
        self.file_type = file_name.split(".", 0).lower()
