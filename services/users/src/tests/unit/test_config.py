import os


def test_development_config(test_app):
    test_app.config.from_object("src.config.DevelopmentConfig")
    assert test_app.config["JWT_SECRET_KEY"] == "my_secret_key"
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get(
        "DATABASE_USERS_URL",
    )
    assert test_app.config["JWT_ACCESS_TOKEN_EXPIRES"] == 900
    assert test_app.config["JWT_REFRESH_TOKEN_EXPIRES"] == 2592000


def test_testing_config(test_app):
    test_app.config.from_object("src.config.TestingConfig")
    assert test_app.config["JWT_SECRET_KEY"] == "my_secret_key"
    assert test_app.config["TESTING"]
    assert not test_app.config["PRESERVE_CONTEXT_ON_EXCEPTION"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get(
        "DATABASE_TEST_USERS_URL",
    )
    assert test_app.config["JWT_ACCESS_TOKEN_EXPIRES"] == 3
    assert test_app.config["JWT_REFRESH_TOKEN_EXPIRES"] == 3


def test_production_config(test_app):
    test_app.config.from_object("src.config.ProductionConfig")
    assert test_app.config["JWT_SECRET_KEY"] == "my_secret_key"
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get(
        "DATABASE_URL",
    )
    assert test_app.config["JWT_ACCESS_TOKEN_EXPIRES"] == 900
    assert test_app.config["JWT_REFRESH_TOKEN_EXPIRES"] == 2592000
