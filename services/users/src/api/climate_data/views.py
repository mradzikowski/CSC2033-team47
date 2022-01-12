from flask_restx import Namespace, Resource, fields

from src.api.crud.crud_climate_data import (  # isort:skip
    get_bloomberg_data_today,
    get_nasa_data_today,
    get_world_counts_data_today,
)

climate_data_namespace = Namespace("climate_data")

world_counts_climate_data = climate_data_namespace.model(
    "WorldCountsClimateData",
    {
        "id": fields.Integer(required=True),
        "world_average_temperature": fields.Float(required=True),
        "tons_of_co2": fields.Integer(required=True),
        "tons_of_melted_ice": fields.Integer(required=True),
        "rise_in_sea_levels_in_cm": fields.Float(required=True),
        "cost_of_not_acting_on_climate_change": fields.Integer(required=True),
        "energy_used": fields.Integer(required=True),
        "solar_energy_striking_earth": fields.Integer(required=True),
        "electricity_used": fields.Integer(required=True),
        "percent_electricity_produced_from_renewable_sources": fields.Float(
            required=True,
        ),
        "time_left_to_the_end_of_oil": fields.String(required=True),
    },
)

nasa_climate_data = climate_data_namespace.model(
    "NasaClimateData",
    {
        "id": fields.Integer(required=True),
        "down_arctic_ice_percent": fields.Float(required=True),
        "down_ice_sheets_tons": fields.Integer(required=True),
        "up_sea_level": fields.Float(required=True),
        "up_ocean_heat": fields.Integer(required=True),
        "up_carbon_dioxide": fields.Integer(required=True),
        "up_global_temperature": fields.Integer(required=True),
    },
)

bloomberg_climate_data = climate_data_namespace.model(
    "BloombergClimateData",
    {
        "id": fields.Integer(required=True),
        "greenhouse_emissions": fields.Integer(required=True),
        "nov_increase_temp": fields.Integer(required=True),
        "today_arctic_ice": fields.Float(required=True),
        "carbon_free_power": fields.Integer(required=True),
        "renewable_power_investments": fields.Float(required=True),
    },
)


class WorldCountsDataList(Resource):
    @climate_data_namespace.marshal_with(world_counts_climate_data)
    def get(self):
        climate_data_db = get_world_counts_data_today()
        response_obj = {}
        if not climate_data_db:
            response_obj["message"] = "Failed to load the world counts climate data."
            return response_obj, 400
        else:
            return climate_data_db, 200


class NasaDataList(Resource):
    @climate_data_namespace.marshal_with(nasa_climate_data)
    def get(self):
        nasa_climate_data_db = get_nasa_data_today()
        response_obj = {}
        if not nasa_climate_data_db:
            response_obj["message"] = "Failed to load the nasa climate data."
            return response_obj, 400
        else:
            return nasa_climate_data_db, 200


class BloombergDataList(Resource):
    @climate_data_namespace.marshal_with(bloomberg_climate_data)
    def get(self):
        bloomberg_climate_data_db = get_bloomberg_data_today()
        response_obj = {}
        if not bloomberg_climate_data_db:
            response_obj["message"] = "Failed to load the climate data."
            return response_obj, 400
        else:
            return bloomberg_climate_data_db, 200


climate_data_namespace.add_resource(WorldCountsDataList, "/worldcounts")
climate_data_namespace.add_resource(NasaDataList, "/nasa")
climate_data_namespace.add_resource(BloombergDataList, "/bloomberg")
