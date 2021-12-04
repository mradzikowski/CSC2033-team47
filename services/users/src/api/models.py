from sqlalchemy.sql import func
from src import db


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
