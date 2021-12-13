from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from src.api.crud_users import get_user_by_id, update_user_dataset_counter
from werkzeug.utils import secure_filename

from src.api.crud_datasets import (  # isort:skip
    add_dataset,
    get_dataset_by_id,
    get_datasets_by_category,
    get_all_datasets,
    get_categories,
    increment_dataset_ranking,
)


datasets_namespace = Namespace("datasets")

# TODO: decide on allowed file extensions
ALLOWED_EXTENSIONS = {"txt", "pdf", "csv"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


dataset = datasets_namespace.model(
    "Dataset",
    {
        "file_name": fields.String(required=True),
        "title": fields.String(required=True),
        "category": fields.String(required=True),
        "twitter_link": fields.String(required=False),
        "rating": fields.Integer(required=False),
    },
)

category = datasets_namespace.model(
    "Category",
    {
        "category_name": fields.String(required=True),
    },
)


class DatasetListUsers(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self):
        """Returns all datasets"""
        return get_all_datasets(), 200

    @datasets_namespace.expect(dataset, validate=True)
    @jwt_required()
    def post(self):
        """Uploads a new dataset"""
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

            # After the uploading, the increment the counter of uploads for user
            identity = get_jwt_identity()
            user = get_user_by_id(identity)
            update_user_dataset_counter(user)

            response_object["message"] = f"{title} has been uploaded by {user_id}"
            return response_object, 201


class Dataset(Resource):
    @datasets_namespace.marshal_with(dataset)
    def get(self, dataset_id):
        """Returns dataset by id"""
        return get_dataset_by_id(dataset_id), 200


class DatasetRating(Resource):
    @datasets_namespace.marshal_with(dataset)
    def post(self, dataset_id):
        """Upvote for the dataset"""
        dataset = increment_dataset_ranking(dataset_id)
        return dataset, 200


class DatasetListCategory(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self, category_name):
        """Returns datasets by category"""
        return get_datasets_by_category(category_name), 200


class CategoryList(Resource):
    @datasets_namespace.marshal_with(category, as_list=True)
    def get(self):
        """Returns list of categories"""
        return get_categories(), 200


datasets_namespace.add_resource(Dataset, "/<int:dataset_id>")
datasets_namespace.add_resource(DatasetListUsers, "")
datasets_namespace.add_resource(DatasetListCategory, "/category/<string:category_name>")
datasets_namespace.add_resource(CategoryList, "/category")
datasets_namespace.add_resource(DatasetRating, "/vote/<int:dataset_id>")
