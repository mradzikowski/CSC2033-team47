import json


def test_get_tweets(test_app):

    client = test_app.test_client()

    resp = client.get(
        "/tweets/recent",
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    # 15, because we retrieve one recent tweet from the account
    assert len(data) == 15

    assert resp.status_code == 200


def test_get_already_retreived_tweets(test_app):

    client = test_app.test_client()

    resp = client.get(
        "/tweets/recent",
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    # 15, because we retrieve one recent tweet from the account
    assert len(data) == 15

    assert resp.status_code == 200
