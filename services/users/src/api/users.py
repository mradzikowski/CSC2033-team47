from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from src.api.models import User

from src.api.crud_users import (  # isort:skip
    add_user,
    delete_user,
    get_all_users,
    get_user_by_email,
    get_user_by_id,
    update_user,
)

users_blueprint = Blueprint("users", __name__)
api = Api(users_blueprint)

user = api.model(
    "User",
    {
        "user_id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "date_created": fields.DateTime,
    },
)

user_post = api.model(
    "User post",
    user,
    {
        "user_id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True),
        "date_created": fields.DateTime,
    },
)


class UsersList(Resource):
    @api.expect(user_post, validate=True)
    def post(self):
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

    @api.marshal_with(user, as_list=True)
    def get(self):
        return get_all_users(), 200


class Users(Resource):
    @api.marshal_with(user)
    def get(self, user_id):
        user = User.query.filter_by(user_id=user_id).first()
        if not user:
            api.abort(404, f"User {user_id} does not exist")
        return user, 200

    def delete(self, user_id):
        response_object = {}
        user = get_user_by_id(user_id=user_id)
        if not user:
            api.abort(404, f"User {user_id} does not exist")

        delete_user(user)

        response_object["message"] = f"{user.email} was deleted!"
        return response_object, 200

    @api.expect(user, validate=True)
    def put(self, user_id):
        post_data = request.get_json()
        email = post_data.get("email")
        username = post_data.get("username")
        response_object = {}

        user = get_user_by_id(user_id)

        if not user:
            api.abort(404, f"User {user_id} does not exist")

        update_user(user=user, username=username, email=email)

        response_object["message"] = f"{user_id} was updated!"
        return response_object, 200


api.add_resource(UsersList, "/users")
api.add_resource(Users, "/users/<int:user_id>")
