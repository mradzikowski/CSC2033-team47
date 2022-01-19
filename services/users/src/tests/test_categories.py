"""Testing category api routes"""
import json


def test_get_all_categories(test_app, test_database, add_category):
    add_category("carbon_emission")
    add_category("gas_emission")
    add_category("climate_change")

    client = test_app.test_client()
    resp = client.get(
        "/datasets/category",
        content_type="application/json",
    )

    data = json.loads(resp.data.decode())

    assert len(data) == 3
    assert "carbon_emission" in data[0]["category_name"]
    assert "gas_emission" in data[1]["category_name"]
    assert "climate_change" in data[2]["category_name"]
