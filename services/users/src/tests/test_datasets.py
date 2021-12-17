import json

from src.api.models import Category, Dataset


def test_get_datasets(test_app, test_database, add_user, add_dataset, add_category):
    test_database.session.query(Dataset).delete()
    add_category("gas-emission")
    add_category("gas-emission1")
    add_category("gas-emission2")

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

    assert 0 == data[0]["rating"]
    assert 0 == data[1]["rating"]
    assert 0 == data[2]["rating"]


def test_get_datasets_by_category(
    test_app,
    test_database,
    add_dataset,
    add_user,
    add_category,
):
    add_category("carbon")
    user = add_user("Matty", "matty@email.com", "123456")
    add_dataset(user.user_id, "file_name", "carbon", "gas-emission-title")
    add_dataset(user.user_id, "file_name1", "carbon", "gas-emission-title1")
    add_dataset(user.user_id, "file_name2", "carbon", "gas-emission-title2")

    client = test_app.test_client()

    resp = client.get(
        "/datasets/category/carbon",
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    assert len(data) == 3
    assert "file_name" in data[0]["file_name"]
    assert "carbon" in data[0]["category"]
    assert "gas-emission-title" in data[0]["title"]
    assert "file_name1" in data[1]["file_name"]
    assert "carbon" in data[1]["category"]
    assert "gas-emission-title1" in data[1]["title"]
    assert "file_name2" in data[2]["file_name"]
    assert "carbon" in data[2]["category"]
    assert "gas-emission-title2" in data[2]["title"]

    assert 0 == data[0]["rating"]
    assert 0 == data[1]["rating"]
    assert 0 == data[2]["rating"]


def test_voting_for_dataset(test_app, test_database, add_dataset, add_user):
    user = add_user("Matty", "matty@email.com", "123456")
    dataset = add_dataset(user.user_id, "file_name", "carbon", "gas-emission-title")

    client = test_app.test_client()

    resp = client.post(
        f"/datasets/vote/{dataset.dataset_id}",
    )

    data = json.loads(resp.data.decode())

    assert 1 == data["rating"]
    assert resp.status_code == 200

    resp_two = client.post(
        f"/datasets/vote/{dataset.dataset_id}",
    )

    data = json.loads(resp_two.data.decode())

    assert 2 == data["rating"]
    assert resp.status_code == 200


def test_get_trending_datasets_whole_time(
    test_app,
    test_database,
    add_dataset,
    add_user,
    add_category,
):
    test_database.session.query(Dataset).delete()
    test_database.session.query(Category).delete()
    user = add_user("Matty", "matty@email.com", "123456")
    add_category("carbon")
    add_dataset(user.user_id, "file_name", "carbon", "gas-emission-title", rating=10)
    add_dataset(user.user_id, "file_name1", "carbon", "gas-emission-title1", rating=50)
    add_dataset(user.user_id, "file_name2", "carbon", "gas-emission-title2", rating=3)

    client = test_app.test_client()

    resp = client.get(
        "/datasets/trending/all",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 3
    assert "gas-emission-title1" in data[0]["title"]
    assert "gas-emission-title" in data[1]["title"]
    assert "gas-emission-title2" in data[2]["title"]
