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


class Dataset(db.Model):
    __tablename__ = "datasets"

    dataset_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # TODO: associate the user_id with the user from the current session
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id"))
    file_name = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    category = db.Column(db.String(256), nullable=False)
    file_type = db.Column(db.String(128), nullable=False)
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(self, user_id, file_name, category, title):
        self.user_id = user_id
        self.file_name = file_name
        self.title = title
        self.category = category
        self.file_type = file_name.split(".", 0)[0].lower()
