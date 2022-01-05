import json


def test_climate_data_get(test_app, test_database, add_climate_data):
    add_climate_data(
        "14.9419",
        "529737463",
        " 9193591948",
        "26.4164",
        "16506141243376",
        "7134823",
        "47319965380",
        "945653",
        "28.4107",
        " 45y 359d 12h 19m 54s",
    )
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/all",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 1
    assert data[0]["world_average_temperature"] == 14.9419


# TODO: ADD TEST FOR CHECKING NEXT DAY (MOCK NEXT DAY)
