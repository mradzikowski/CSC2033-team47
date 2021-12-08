from flask_jwt_extended import create_access_token


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("thatsatest1", "test@test.com", "simplepassword")
    user_two = add_user("thatsatest2", "test@test2.com", "simplepassword")
    assert user_two.password != user_one.password


def test_encode_token(test_app, test_database, add_user):
    user = add_user("thatsatest1", "test@test3.com", "simplepassword")
    token = create_access_token(identity=user.user_id)
    assert isinstance(token, str)
