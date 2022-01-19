"""Endpoints and resources for twitter ids"""
from flask_restx import Namespace, Resource

from .twitter_handler import TWITTER_HANDLER

twitter_data_namespace = Namespace("twitter_ids")


class TwitterIdsDataList(Resource):
    def get(self):
        twitter_ids = TWITTER_HANDLER.get_all_new_tweets()
        response_obj = {}
        if not twitter_ids:
            response_obj["message"] = "Failed to load the twitter ids."
            return response_obj, 400
        else:
            return twitter_ids, 200


twitter_data_namespace.add_resource(TwitterIdsDataList, "/recent")
