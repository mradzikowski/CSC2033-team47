import json

import pytest
from src.api.models import User


def test_add_user(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps(
            {
                "username": "Mateusz",
                "email": "mateusz@email.com",
            },
        ),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())

    assert resp.status_code == 201
    assert "mateusz@email.com was added!" in data["message"]


@pytest.mark.parametrize(
    "payload, status_code, message",
    [
        # Checking for invalid json
        [{}, 400, "Input payload validation failed"],
        # Checking for invalid json keys
        [{"email": "mateusz@email.com"}, 400, "Input payload validation failed"],
    ],
)
def test_add_user_invalid(test_app, test_database, payload, status_code, message):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps(payload),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())

    assert resp.status_code == status_code
    assert message in data["message"]


def test_add_user_duplicate_email(test_app, test_database):
    client = test_app.test_client()
    client.post(
        "/users",
        data=json.dumps(
            {
                "username": "Mateusz",
                "email": "mateusz@email.com",
            },
        ),
        content_type="application/json",
    )
    resp = client.post(
        "/users",
        data=json.dumps(
            {
                "username": "Mateusz",
                "email": "mateusz@email.com",
            },
        ),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "The email already exists." in data["message"]


def test_single_user(test_app, test_database, add_user):
    user = add_user(username="Andrew", email="andrew@email.com")

    client = test_app.test_client()
    resp = client.get(f"/users/{user.user_id}")
    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert "Andrew" in data["username"]
    assert "andrew@email.com" in data["email"]


def test_single_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get("/users/9999999999")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User 9999999999 does not exist" in data["message"]


def test_all_users(test_app, test_database, add_user):
    test_database.session.query(User).delete()
    add_user("Johny", "johny@email.com")
    add_user("Toby", "toby@email.com")
    client = test_app.test_client()

    resp = client.get("/users")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert len(data) == 2
    assert "Johny" in data[0]["username"]
    assert "johny@email.com" in data[0]["email"]
    assert "Toby" in data[1]["username"]
    assert "toby@email" in data[1]["email"]


def test_remove_user(test_app, test_database, add_user):
    test_database.session.query(User).delete()
    user = add_user("Johny", "johny@email.com")
    client = test_app.test_client()

    resp_one = client.get("/users")
    data = json.loads(resp_one.data.decode())
    assert resp_one.status_code == 200
    assert len(data) == 1

    resp_two = client.delete(f"/users/{user.user_id}")
    data = json.loads(resp_two.data.decode())
    assert resp_two.status_code == 200
    assert "johny@email.com was deleted!" in data["message"]

    resp_three = client.get("/users")
    data = json.loads(resp_three.data.decode())
    assert resp_three.status_code == 200
    assert len(data) == 0


def test_remove_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.delete("/users/99999")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User 99999 does not exist" in data["message"]


def test_update_user(test_app, test_database, add_user):
    test_database.session.query(User).delete()
    user = add_user("Johny", "johny@email.com")
    client = test_app.test_client()

    resp_one = client.get("/users")
    data = json.loads(resp_one.data.decode())
    assert resp_one.status_code == 200
    assert len(data) == 1

    resp_two = client.put(
        f"/users/{user.user_id}",
        data=json.dumps(
            {
                "username": "Johny",
                "email": "johny_changed_email@email.com",
            },
        ),
        content_type="application/json",
    )
    data = json.loads(resp_two.data.decode())
    assert resp_two.status_code == 200
    assert f"{user.user_id} was updated!" in data["message"]

    resp_three = client.get(f"/users/{user.user_id}")
    data = json.loads(resp_three.data.decode())
    assert resp_three.status_code == 200
    assert "Johny" in data["username"]
    assert "johny_changed_email@email.com" in data["email"]


@pytest.mark.parametrize(
    "user_id, payload, status_code, message",
    [
        # Checking for invalid json
        [1, {}, 400, "Input payload validation failed"],
        # Checking for user that does not exist
        [
            99999,
            {
                "username": "Mateusz",
                "email": "mateusz_my_email_does_exist@email.com",
            },
            404,
            "User 99999 does not exist",
        ],
    ],
)
def test_update_user_invalid(
    test_app,
    test_database,
    user_id,
    payload,
    status_code,
    message,
):
    client = test_app.test_client()
    resp = client.put(
        f"/users/{user_id}",
        data=json.dumps(payload),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == status_code
    assert message in data["message"]
