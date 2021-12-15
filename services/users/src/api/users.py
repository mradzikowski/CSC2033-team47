from flask import request
from flask_restx import Namespace, Resource, fields
from src.api.models import User

from src.api.crud_users import (  # isort:skip
    add_user,
    delete_user,
    get_all_users,
    get_user_by_email,
    get_user_by_id,
    update_user,
    get_users_by_ranking,
)

users_namespace = Namespace("users")

user = users_namespace.model(
    "User",
    {
        "user_id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "date_created": fields.DateTime,
    },
)

user_post = users_namespace.model(
    "UserPost",
    user,
    {
        "user_id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True),
        "date_created": fields.DateTime,
    },
)

user_ranking = users_namespace.model(
    "UserRanking",
    {
        "username": fields.String(required=True),
        "dataset_upload_counter": fields.Integer(required=True),
    },
)


class UsersList(Resource):
    @users_namespace.expect(user_post, validate=True)
    def post(self):
        """Creates a new user"""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")

        response_object = {}

        user = get_user_by_email(email=email)

        if user:
            response_object["message"] = "The email already exists."
            return response_object, 400

        add_user(username=username, email=email, password=password)

        response_object = {
            "message": f"{email} was added!",
        }

        return response_object, 201

    @users_namespace.marshal_with(user, as_list=True)
    def get(self):
        """Returns all users"""
        return get_all_users(), 200


class Users(Resource):
    @users_namespace.marshal_with(user)
    def get(self, user_id):
        """Returns a user by id"""
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        return user, 200

    def delete(self, user_id):
        """Deletes a user by id"""
        response_object = {}
        user = get_user_by_id(user_id=user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        delete_user(user)

        response_object["message"] = f"{user.email} was deleted!"
        return response_object, 200

    @users_namespace.expect(user, validate=True)
    def put(self, user_id):
        """Updates a user by id"""
        post_data = request.get_json()
        email = post_data.get("email")
        username = post_data.get("username")
        response_object = {}

        user = get_user_by_id(user_id)

        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        update_user(user=user, username=username, email=email)

        response_object["message"] = f"{user_id} was updated!"
        return response_object, 200


class UsersRanking(Resource):
    @users_namespace.marshal_with(user_ranking)
    def get(self):
        """Returns the ranking of users by upload files"""
        return get_users_by_ranking(), 200


users_namespace.add_resource(UsersList, "")
users_namespace.add_resource(Users, "/<int:user_id>")
users_namespace.add_resource(UsersRanking, "/ranking")
