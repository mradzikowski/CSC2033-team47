import pytest
from src.api.models import User


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("thatsatest1", "test@test.com", "simplepassword")
    user_two = add_user("thatsatest2", "test@test2.com", "simplepassword")
    assert user_two.password != user_one.password


@pytest.mark.parametrize("token_type", [["access"], ["refresh"]])
def test_encode_token(test_app, test_database, add_user, token_type):
    user = add_user("thatsatest1", "test@test3.com", "simplepassword")
    token = user.encode_auth_token(user.user_id, token_type)
    assert isinstance(token, str)


def test_decode_token(test_app, test_database, add_user):
    user = add_user("thatsatest1", "test@test3.com", "simplepassword")
    token = user.encode_auth_token(user.user_id, "access")
    assert isinstance(token, str)
    assert User.decode_auth_token(token) == user.user_id
