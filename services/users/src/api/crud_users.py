from src import db
from src.api.models import User


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id: int):
    return User.query.filter_by(user_id=user_id).first()


def get_user_by_email(email: str):
    return User.query.filter_by(email=email).first()


def add_user(username: str, email: str, password: str):
    user = User(username, email, password)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user: User, username: str, email: str):
    user.username = username
    user.email = email


def delete_user(user: User):
    db.session.delete(user)
    db.session.commit()
    return user
