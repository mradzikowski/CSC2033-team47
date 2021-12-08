import redis
import werkzeug.security
from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from src import jwt
from src.api.crud import add_user, get_user_by_email, get_user_by_id

from flask_jwt_extended import (  # isort:skip
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)

auth_blueprint = Blueprint("auth", __name__)
api = Api(auth_blueprint)


user = api.model(
    "User",
    {
        "username": fields.String(required=True),
        "email": fields.String(required=True),
    },
)

user_with_password = api.model(
    "User_with_password",
    {
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    },
)

login_user = api.model(
    "Login_user",
    {
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    },
)

refresh_token = api.model(
    "Refresh token",
    {"refresh_token": fields.String(required=True)},
)

tokens = api.model(
    "Tokens",
    {
        "access_token": fields.String(required=True),
        "refresh_token": fields.String(required=True),
    },
)


class Register(Resource):
    @api.marshal_with(user)
    @api.expect(user_with_password, validate=True)
    def post(self):
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")

        user = get_user_by_email(email=email)

        if user:
            api.abort(400, "The email already exists.")

        user = add_user(username, email, password)

        return user, 201


class Login(Resource):
    @api.marshal_with(tokens)
    @api.expect(login_user, validate=True)
    def post(self):
        post_data = request.get_json()
        email = post_data.get("email")
        password = post_data.get("password")

        user = get_user_by_email(email=email)

        if not user or werkzeug.security.check_password_hash(user.password, password):
            api.abort(404, "User does not exist.")

        access_token = create_access_token(identity=user.user_id)
        refresh_token = create_refresh_token(identity=user.user_id)

        response_object = {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }

        return response_object, 200


class Refresh(Resource):
    @api.expect(refresh_token)
    @jwt_required(refresh=True)
    def post(self):
        identity = get_jwt_identity()
        access_token = create_access_token(identity=identity)
        refresh_token = create_refresh_token(identity=identity)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
        }, 200


class Status(Resource):
    @api.marshal_with(user)
    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        user = get_user_by_id(identity)
        return user, 200


jwt_redis_blocklist = redis.StrictRedis(
    host="redis",
    port=6379,  # , db=0, decode_responses=True
)


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token_in_redis = jwt_redis_blocklist.get(jti)
    return token_in_redis is not None


class Logout(Resource):
    @jwt_required()
    def delete(self):
        jti = get_jwt()["jti"]
        jwt_redis_blocklist.set(jti, "", ex=3600)
        return jsonify(msg="Access token revoked")


api.add_resource(Register, "/auth/register")
api.add_resource(Login, "/auth/login")
api.add_resource(Refresh, "/auth/refresh")
api.add_resource(Status, "/auth/status")
api.add_resource(Logout, "/auth/logout")
