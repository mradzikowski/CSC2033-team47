from flask_restx import Namespace, Resource, fields
from src.api.crud.crud_climate_data import get_climate_data_today

climate_data_namespace = Namespace("climate_data")

climate_data = climate_data_namespace.model(
    "ClimateData",
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


class ClimateDataList(Resource):
    @climate_data_namespace.marshal_with(climate_data)
    def get(self):
        climate_data_db = get_climate_data_today()
        response_obj = {}
        if not climate_data_db:
            response_obj["message"] = "Failed to load the climate data."
            return response_obj, 400
        else:
            return climate_data_db, 200


climate_data_namespace.add_resource(ClimateDataList, "/all")
