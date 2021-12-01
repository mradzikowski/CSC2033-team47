import os

from flask import Flask
from flask_restx import Api, Resource

app = Flask(__name__)

api = Api(app)

# Taking application settings from dockerfile while running
app_settings = os.getenv("APP_SETTINGS")
app.config.from_object(app_settings)


class Ping(Resource):
    def get(self):
        return {
            "status": "success",
            "message": "pong from the climate extractor microservice!",
        }


api.add_resource(Ping, "/ping")
