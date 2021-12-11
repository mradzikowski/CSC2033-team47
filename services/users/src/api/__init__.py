from flask_restx import Api
from src.api.auth import auth_namespace
from src.api.datasets import datasets_namespace
from src.api.users import users_namespace

api = Api(version="1.0", title="API backend", doc="/doc")

api.add_namespace(auth_namespace, "/auth")
api.add_namespace(datasets_namespace, "/datasets")
api.add_namespace(users_namespace, "/users")
