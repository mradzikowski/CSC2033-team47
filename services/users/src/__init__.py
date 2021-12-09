import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
jwt = JWTManager()


def create_app(script_info=None):
    app = Flask(__name__)

    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)
    upload_folder = os.getenv("UPLOAD_FOLDER")
    app.config["UPLOAD_FOLDER"] = upload_folder
    app.config["MAX_CONTENT_LENGTH"] = 1000 * 1000

    db.init_app(app)
    jwt.init_app(app)

    from src.api.auth import auth_blueprint
    from src.api.datasets import datasets_blueprint
    from src.api.ping import ping_blueprint
    from src.api.users import users_blueprint

    app.register_blueprint(ping_blueprint)
    app.register_blueprint(users_blueprint)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(datasets_blueprint)

    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
