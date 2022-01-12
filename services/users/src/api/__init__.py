from flask_restx import Api
from src.api.auth.views import auth_namespace
from src.api.climate_data.views import climate_data_namespace
from src.api.datasets.views import datasets_namespace
from src.api.tweets.views import twitter_data_namespace
from src.api.users.views import users_namespace

api = Api(version="1.0", title="API backend", doc="/doc")

api.add_namespace(auth_namespace, "/auth")
api.add_namespace(datasets_namespace, "/datasets")
api.add_namespace(users_namespace, "/users")
api.add_namespace(climate_data_namespace, "/climatedata")
api.add_namespace(twitter_data_namespace, "/tweets")
