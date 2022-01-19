"""CRUD operations related to users"""
from typing import List, Union

from sqlalchemy import desc
from src import db
from src.api.models import User


def get_all_users() -> Union[List[User], None]:
    """Method to retrieve all users from the database"""
    return User.query.all()


def get_user_by_id(user_id: int) -> Union[User, None]:
    """Method to retrieve the user by their id"""
    return User.query.filter_by(user_id=user_id).first()


def get_user_by_email(email: str) -> Union[User, None]:
    """Method to retrieve the user by their emal"""
    return User.query.filter_by(email=email).first()


def add_user(username: str, email: str, password: str) -> User:
    """Method to add user to the database"""
    user = User(username, email, password)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user: User, username: str, email: str) -> None:
    """Method to update the user information in the database"""
    user.username = username
    user.email = email
    db.session.commit()


def update_user_dataset_counter(user: User) -> None:
    """Method to update the dataset upload counter for user"""
    user.dataset_upload_counter += 1
    db.session.commit()


def delete_user(user: User) -> User:
    """Method to delete user from the database"""
    db.session.delete(user)
    db.session.commit()
    return user


def get_users_by_ranking() -> Union[List[User], None]:
    """Method to retrieve users in descending order by their upload counter"""
    return User.query.order_by(desc(User.dataset_upload_counter)).all()


def get_users_with_subscription() -> Union[List[User], None]:
    """Method to retrieve users that have active subscription"""
    return User.query.filter_by(subscribed=True).all()


def update_user_subscription(user_id: int) -> Union[bool, None]:
    """Method to update user's subscription in the database"""
    user = get_user_by_id(user_id)
    if user:
        if user.subscribed:
            user.subscribed = False
        else:
            user.subscribed = True
        db.session.commit()
        return user.subscribed
    return None
