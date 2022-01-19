"""Endpoints and resources for authentication"""
import werkzeug.security
from flask import request
from flask_restx import Namespace, Resource, fields
from src.api.crud.crud_users import add_user, get_user_by_email, get_user_by_id

from flask_jwt_extended import (  # isort:skip
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

auth_namespace = Namespace("auth")

user = auth_namespace.model(
    "User",
    {
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "date_created": fields.DateTime(required=False),
        "subscribed": fields.Boolean(required=False),
    },
)

user_with_password = auth_namespace.model(
    "User_with_password",
    {
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    },
)

login_user = auth_namespace.model(
    "Login_user",
    {
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    },
)

refresh_token = auth_namespace.model(
    "Refresh token",
    {"refresh_token": fields.String(required=True)},
)

tokens = auth_namespace.model(
    "Tokens",
    {
        "access_token": fields.String(required=True),
        "refresh_token": fields.String(required=True),
    },
)


class Register(Resource):
    @auth_namespace.marshal_with(user)
    @auth_namespace.expect(user_with_password, validate=True)
    def post(self):
        """Registers a new user"""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")

        user = get_user_by_email(email=email)

        if user:
            auth_namespace.abort(400, "The email already exists.")

        user = add_user(username=username, email=email, password=password)

        return user, 201


class Login(Resource):
    @auth_namespace.marshal_with(tokens)
    @auth_namespace.expect(login_user, validate=True)
    def post(self):
        """Logins a user"""
        post_data = request.get_json()
        email = post_data.get("email")
        password = post_data.get("password")

        user = get_user_by_email(email=email)
        if not user or not werkzeug.security.check_password_hash(
            user.password,
            password,
        ):
            auth_namespace.abort(404, "User does not exist.")

        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)

        response_object = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        return response_object, 200


class Refresh(Resource):
    @auth_namespace.marshal_with(tokens)
    @jwt_required(refresh=True)
    def post(self):
        """Refreshes a token"""
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }, 200


class Status(Resource):
    @auth_namespace.marshal_with(user)
    @jwt_required()
    def get(self):
        """Returns the user by authentication token"""
        identity = get_jwt_identity()
        user = get_user_by_id(identity)
        return user, 200


auth_namespace.add_resource(Register, "/register")
auth_namespace.add_resource(Login, "/login")
auth_namespace.add_resource(Refresh, "/refresh")
auth_namespace.add_resource(Status, "/status")
