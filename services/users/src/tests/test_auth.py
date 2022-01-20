import json

import pytest
from flask import current_app


def test_user_registration(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/auth/register",
        data=json.dumps(
            {
                "username": "testuser",
                "email": "testemail@email.com",
                "password": "test_password",
            },
        ),
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())
    assert resp.status_code == 201
    assert "testuser" in data["username"]
    assert "testemail@email.com" in data["email"]
    assert "password" not in data


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"email": "mail@mail.com"},
        {"username": "mateusz", "email": "email@email.com"},
        {"username": "mateusz", "password": "123456"},
        {"email": "mail@mail.com", "password": "123456"},
    ],
)
def test_invalid_json(test_app, test_database, payload):
    client = test_app.test_client()
    resp = client.post(
        "/auth/register",
        data=json.dumps(
            payload,
        ),
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Input payload validation failed" in data["message"]


def test_registered_user(test_app, test_database, add_user):
    client = test_app.test_client()
    client.post(
        "/auth/register",
        data=json.dumps(
            {
                "username": "Jacob",
                "email": "jacob@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    resp = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "jacob@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert resp.content_type == "application/json"

    assert data["access_token"]
    assert data["refresh_token"]


def test_not_registered_user(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "m@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert resp.content_type == "application/json"
    assert "User does not exist" in data["message"]


def test_valid_refresh(test_app, test_database, add_user):
    add_user("Matt", "matt@email.com", "123456")
    client = test_app.test_client()
    resp_login = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "matt@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    refresh_token = json.loads(resp_login.data.decode())["refresh_token"]

    resp = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(refresh_token)},
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert resp_login.status_code == 200
    assert resp_login.content_type == "application/json"
    assert data["access_token"]
    assert data["refresh_token"]
    assert resp.content_type == "application/json"


def test_invalid_refresh(test_app, test_database, add_user):
    add_user("Mat", "mat@email.com", "123456")
    client = test_app.test_client()
    current_app.config["JWT_REFRESH_TOKEN_EXPIRES"] = -1
    resp_login = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "mat@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )
    refresh_token = json.loads(resp_login.data.decode())["refresh_token"]

    resp = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer {}".format(refresh_token)},
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 401
    assert resp_login.status_code == 200
    assert resp_login.content_type == "application/json"
    assert not data.get("access_token", None)
    assert not data.get("refresh_token", None)
    assert resp.content_type == "application/json"
    assert "Token has expired" in data["msg"]


def test_user_status(test_app, test_database, add_user):
    user = add_user("Matt", "matt@email.com", "123456")
    client = test_app.test_client()
    resp_login = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "matt@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    access_token = json.loads(resp_login.data.decode())["access_token"]

    resp = client.get(
        "/auth/status",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert resp_login.status_code == 200
    assert resp_login.content_type == "application/json"
    assert user.username in data["username"]
    assert user.email in data["email"]
    assert "password" not in data
    assert resp.content_type == "application/json"


def test_user_invalid_status(test_app, test_database):
    client = test_app.test_client()
    resp = client.get(
        "/auth/status",
        headers={"Authorization": "Bearer token"},
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    assert "Not enough segments" in data["msg"]
