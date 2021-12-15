from sqlalchemy import desc
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
    db.session.commit()


def update_user_dataset_counter(user: User):
    user.dataset_upload_counter += 1
    db.session.commit()


def delete_user(user: User):
    db.session.delete(user)
    db.session.commit()
    return user


def get_users_by_ranking():
    return User.query.order_by(desc(User.dataset_upload_counter)).all()
