import json

import pytest
from src.api.crud.crud_users import get_user_by_id
from src.api.models import User
from werkzeug.security import check_password_hash


def test_add_user(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps(
            {
                "username": "Mateusz",
                "email": "mateusz@email.com",
                "password": "simple_password",
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
                "password": "simple_password",
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
                "password": "simple_password",
            },
        ),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "The email already exists." in data["message"]


def test_single_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get("/users/9999999999")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User 9999999999 does not exist" in data["message"]


def test_all_users(test_app, test_database, add_user):
    test_database.session.query(User).delete()
    add_user("Johny", "johny@email.com", "simple_password")
    add_user("Toby", "toby@email.com", "simple_password")
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
    user = add_user("Johny", "johny@email.com", "simple_password")
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
    user = add_user("Johny", "johny@email.com", "simple_password")
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
                "password": "simple_password",
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
                "password": "simple_password",
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


def test_single_user(test_app, test_database, add_user):
    user = add_user(
        username="Matthew",
        email="matthew@email.com",
        password="simple_password",
    )
    client = test_app.test_client()
    resp = client.get(f"/users/{user.user_id}")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert "Matthew" in data["username"]
    assert "matthew@email.com" in data["email"]
    assert "password" not in data


def test_update_user_not_changing_password(test_app, test_database, add_user):
    password_one = "not_changed_password"
    password_two = "not_going_to_be_set"

    user = add_user(username="Matthew", email="matt@email.com", password=password_one)

    assert check_password_hash(user.password, password_one)

    client = test_app.test_client()

    resp = client.put(
        f"/users/{user.user_id}",
        data=json.dumps(
            {
                "username": "Maria",
                "email": "maria@email.com",
                "password": password_two,
            },
        ),
        content_type="application/json",
    )

    assert resp.status_code == 200

    user = get_user_by_id(user.user_id)

    assert check_password_hash(user.password, password_one)
    assert not check_password_hash(user.password, password_two)


def test_get_users_ranking(
    test_app,
    test_database,
    add_user,
    add_category,
    add_dataset,
):
    test_database.session.query(User).delete()

    add_category("carbon")

    user_first = add_user(
        username="Matthew",
        email="matt@email.com",
        password="too_hard_to_crack",
    )
    user_second = add_user(
        username="Melissa",
        email="melissa@email.com",
        password="too_hard_to_crack",
    )
    user_third = add_user(
        username="Toby",
        email="toby@email.com",
        password="too_hard_to_crack",
    )
    user_fourth = add_user(
        username="Joseph",
        email="joseph@email.com",
        password="too_hard_to_crack",
    )

    add_dataset(
        user_id=user_first.user_id,
        file_name="first_dataset",
        category="carbon",
        title="carbon_dataset",
    )
    add_dataset(
        user_id=user_first.user_id,
        file_name="first_dataset1",
        category="carbon",
        title="carbon_dataset",
    )

    add_dataset(
        user_id=user_second.user_id,
        file_name="first_dataset2",
        category="carbon",
        title="carbon_dataset",
    )
    add_dataset(
        user_id=user_second.user_id,
        file_name="first_dataset3",
        category="carbon",
        title="carbon_dataset",
    )
    add_dataset(
        user_id=user_second.user_id,
        file_name="first_dataset4",
        category="carbon",
        title="carbon_dataset",
    )

    add_dataset(
        user_id=user_fourth.user_id,
        file_name="first_dataset5",
        category="carbon",
        title="carbon_dataset",
    )

    client = test_app.test_client()
    resp = client.get(
        "/users/ranking",
    )

    data = json.loads(resp.data.decode())

    print(data)

    assert resp.status_code == 200
    assert len(data) == 4
    assert user_second.username == data[0]["username"]
    assert user_first.username == data[1]["username"]
    assert user_fourth.username == data[2]["username"]
    assert user_third.username == data[3]["username"]


@pytest.mark.parametrize(
    "payload, status_code, message",
    [
        [True, 200, " has subscribed the newsletter."],
        [False, 200, " has unsubscribed the newsletter."],
    ],
)
def test_user_subscribe_unsubscribe(
    test_app,
    test_database,
    add_user,
    payload,
    status_code,
    message,
):
    test_database.session.query(User).delete()
    user = add_user("i_like_subscriptions", "subscriprion@email.com", "123456")
    client = test_app.test_client()

    if not payload:
        user.subscribed = True

    resp = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": "subscriprion@email.com",
                "password": "123456",
            },
        ),
        content_type="application/json",
    )

    resp_login = json.loads(resp.data.decode())

    access_token = resp_login["access_token"]

    assert resp_login["access_token"]
    assert resp_login["refresh_token"]

    resp_subscribe = client.post(
        "/users/subscription",
        content_type="application/json",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = json.loads(resp_subscribe.data.decode())

    return_message = str(user.user_id) + message

    assert resp_subscribe.status_code == status_code
    assert return_message in data["message"]


def test_get_all_users_with_subscriptions(test_app, test_database, add_user):
    test_database.session.query(User).delete()
    user_first = add_user(
        username="Matthew",
        email="matt@email.com",
        password="too_hard_to_crack",
        subscribed=True,
    )
    add_user(
        username="Melissa",
        email="melissa@email.com",
        password="too_hard_to_crack",
        subscribed=False,
    )
    user_third = add_user(
        username="Toby",
        email="toby@email.com",
        password="too_hard_to_crack",
        subscribed=True,
    )
    add_user(
        username="Joseph",
        email="joseph@email.com",
        password="too_hard_to_crack",
        subscribed=False,
    )
    client = test_app.test_client()

    resp = client.get(
        "/users/subscription",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 2
    assert user_first.username == data[0]["username"]
    assert user_third.username == data[1]["username"]
