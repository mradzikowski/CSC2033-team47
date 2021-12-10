import json

import pytest
from src.api.models import Dataset


@pytest.mark.parametrize(
    "payload, status_code, message",
    [
        [{}, 400, "Input payload validation failed"],
        [{"title": "title for simple dataset"}, 400, "Input payload validation failed"],
        [{"category": "carbon-emission"}, 400, "Input payload validation failed"],
    ],
)
def test_upload_file_invalid_json_keys(
    test_app,
    test_database,
    add_user,
    payload,
    status_code,
    message,
):
    user = add_user("Matt", "matt@email.com", "123456")
    client = test_app.test_client()

    resp = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": user.email,
                "password": user.password,
            },
        ),
        content_type="application/json",
    )

    resp_login = json.loads(resp.data.decode())

    access_token = resp_login["access_token"]

    assert resp_login["access_token"]
    assert resp_login["refresh_token"]

    resp_two = client.post(
        "/datasets",
        data={"file": "file_name.pdf"},
        content_type="multipart/form-data",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = json.loads(resp_two.data.decode())

    assert message in data["message"]
    assert status_code == resp_two.status_code


def test_upload_file(test_app, test_database, add_user):
    user = add_user("Matty", "matty@email.com", "123456")
    client = test_app.test_client()

    resp_login = client.post(
        "/auth/login",
        data=json.dumps(
            {
                "email": user.email,
                "password": user.password,
            },
        ),
        content_type="application/json",
    )

    resp_login = json.loads(resp_login.data.decode())

    access_token = resp_login["access_token"]

    assert resp_login["access_token"]
    assert resp_login["refresh_token"]

    file_name = "fake-text-stream.pdf"
    data = {
        "title": "some_title",
        "category": "carbon-emission",
        "file_name": file_name,
    }

    resp_two = client.post(
        "/datasets",
        data=json.dumps(data),
        content_type="application/json",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = json.loads(resp_two.data.decode())
    print(data)

    assert f"some_title has been uploaded by {user.user_id}" in data["message"]
    assert resp_two.status_code == 201


def test_get_datasets(test_app, test_database, add_user, add_dataset):
    test_database.session.query(Dataset).delete()

    user = add_user("Matt", "matt@email.com", "123456")
    add_dataset(user.user_id, "file_name", "gas-emission", "gas-emission-title")
    add_dataset(user.user_id, "file_name1", "gas-emission1", "gas-emission-title1")
    add_dataset(user.user_id, "file_name2", "gas-emission2", "gas-emission-title2")

    client = test_app.test_client()

    resp = client.get(
        "/datasets",
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    print(data)

    assert len(data) == 3
    assert "file_name" in data[0]["file_name"]
    assert "file_name1" in data[1]["file_name"]
    assert "file_name2" in data[2]["file_name"]

    assert "gas-emission" in data[0]["category"]
    assert "gas-emission1" in data[1]["category"]
    assert "gas-emission2" in data[2]["category"]

    assert "gas-emission-title" in data[0]["title"]
    assert "gas-emission-title1" in data[1]["title"]
    assert "gas-emission-title2" in data[2]["title"]