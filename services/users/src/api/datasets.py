from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, Resource, fields
from werkzeug.utils import secure_filename

from src.api.crud_datasets import (  # isort:skip
    add_dataset,
    get_dataset_by_id,
    get_datasets_by_category,
    get_all_datasets,
)

datasets_blueprint = Blueprint("datasets", __name__)
api = Api(datasets_blueprint)

ALLOWED_EXTENSIONS = {"txt", "pdf", "csv"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


dataset = api.model(
    "Dataset",
    {
        "file_name": fields.String(required=True),
        "title": fields.String(required=True),
        "category": fields.String(required=True),
        "twitter_link": fields.String(required=False),
    },
)

category = api.model(
    "Category",
    {
        "category_name": fields.String(required=True),
    },
)


class DatasetListUsers(Resource):
    @api.marshal_with(dataset, as_list=True)
    def get(self):
        return get_all_datasets(), 200

    @api.expect(dataset, validate=True)
    @jwt_required()
    def post(self):
        post_data = request.get_json()
        title = post_data.get("title")
        category = post_data.get("category")
        response_object = {}
        user_id = get_jwt_identity()
        file = post_data.get("file_name")
        if file == "":
            response_object["message"] = "No file selected."
            return response_object, 400
        else:
            filename = secure_filename(file)
            # TODO: ADD SAVING AND UPLOADING PROPER FILES
            # TODO: FOR NOW IT JUST SAVES A FILE PATH IN STR

            add_dataset(
                user_id=user_id,
                file_name=filename,
                title=title,
                category=category,
            )

            response_object["message"] = f"{title} has been uploaded by {user_id}"
            return response_object, 201


class Dataset(Resource):
    @api.marshal_with(dataset)
    def get(self, dataset_id):
        return get_dataset_by_id(dataset_id)


class DatasetListCategory(Resource):
    @api.marshal_with(dataset, as_list=True)
    def get(self, category_name):
        return get_datasets_by_category(category_name), 200


api.add_resource(Dataset, "/datasets/<int:dataset_id>")
api.add_resource(DatasetListUsers, "/datasets")
api.add_resource(DatasetListCategory, "/datasets/category/<string:category_name>")
