import json

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


def test_add_user_invalid_json(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps({}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())

    assert resp.status_code == 400
    assert "Input payload validation failed" in data["message"]


def test_add_user_invalid_keys(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps(
            {
                "email": "mateusz@email.com",
            },
        ),
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 400
    assert "Input payload validation failed" in data["message"]


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
