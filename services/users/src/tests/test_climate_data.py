"""Testing climate data api routes"""
import json

from freezegun import freeze_time


def test_climate_data_world_count_get(
    test_app,
    test_database,
    add_world_count_climate_data,
):
    add_world_count_climate_data(
        "14.9419",
        "529737463",
        "421.22",
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
        "/climatedata/worldcounts",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 1

    assert data[0]["world_average_temperature"] == 14.94


@freeze_time("2022-10-10")
def test_climate_data_world_count_get_new_day(
    test_app,
    test_database,
    add_world_count_climate_data,
):
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/worldcounts",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 12


def test_climate_data_nasa_get(test_app, test_database, add_nasa_climate_data):
    add_nasa_climate_data("13", "428", "3.4", "326", "417", "1")
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/nasa",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 1


@freeze_time("2022-10-10")
def test_climate_data_nasa_get_new_day(test_app, test_database, add_nasa_climate_data):
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/nasa",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 7


def test_climate_data_bloomberg_get(
    test_app,
    test_database,
    add_bloomberg_climate_data,
):
    add_bloomberg_climate_data("52000", "0", "-3.87", "31", "69.9")
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/bloomberg",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 1


@freeze_time("2022-10-10")
def test_climate_data_bloomberg_get_new_day(test_app, test_database):
    client = test_app.test_client()

    resp = client.get(
        "/climatedata/bloomberg",
    )

    data = json.loads(resp.data.decode())

    assert resp.status_code == 200
    assert len(data) == 6
