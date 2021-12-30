import os

from flask import make_response, render_template, request, send_from_directory
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from src.api.crud.crud_users import get_user_by_id, update_user_dataset_counter
from werkzeug.utils import secure_filename

from src.api.crud.crud_datasets import (  # isort:skip
    add_dataset,
    get_dataset_by_id,
    get_datasets_by_category,
    get_all_datasets,
    get_categories,
    increment_dataset_ranking,
    get_trending_datasets_by_days,
    get_trending_datasets_whole_time,
    get_dataset_by_filename,
    increment_dataset_download_counter,
    get_datasets_trending_by_download,
)

datasets_namespace = Namespace("datasets")

# TODO: decide on allowed file extensions
ALLOWED_EXTENSIONS = {"txt", "pdf", "csv"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


dataset = datasets_namespace.model(
    "Dataset",
    {
        "dataset_id": fields.Integer(required=True),
        "file_name": fields.String(required=True),
        "title": fields.String(required=True),
        "category": fields.String(required=True),
        "rating": fields.Integer(required=False),
        "download_counter": fields.Integer(required=False),
    },
)

category = datasets_namespace.model(
    "Category",
    {
        "category_name": fields.String(required=True),
    },
)


class DatasetList(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self):
        """Returns all datasets"""
        return get_all_datasets(), 200


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


class DatasetListTrendingDays(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self, days):
        """Returns the trending post for specific timeframe"""
        return get_trending_datasets_by_days(days), 200


class DatasetListTrending(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self):
        """Returns the trending post for whole time"""
        return get_trending_datasets_whole_time(), 200


class DatasetListTrendingByDownload(Resource):
    @datasets_namespace.marshal_with(dataset, as_list=True)
    def get(self):
        """Returns the trending post for whole time"""
        return get_datasets_trending_by_download(), 200


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


class DatasetRetrieve(Resource):
    def get(self, filename):
        dataset = get_dataset_by_filename(filename)
        if dataset:
            dataset = dataset[0]
            increment_dataset_download_counter(dataset)
            return send_from_directory(
                f"{os.getenv('APP_FOLDER')}/src/media",
                filename,
                as_attachment=True,
            )


class DatasetUpload(Resource):
    def get(self):
        headers = {"Content-Type": "text/html"}
        return make_response(render_template("upload.html"), 200, headers)

    @jwt_required()
    def post(self):
        file = request.files["file"]
        title = request.form.get("title")
        category = request.form.get("category")

        response_object = {}
        user_id = get_jwt_identity()

        if file == "":
            response_object["message"] = "No file selected."
            return response_object, 400
        else:
            filename = secure_filename(file.filename)
            if not allowed_file(filename):
                response_object["message"] = (
                    f"Currently allowed files are {ALLOWED_EXTENSIONS}."
                    f" Please change the file extension."
                )
                return response_object, 400
            file.save(os.path.join(f"{os.getenv('APP_FOLDER')}/src/media", filename))

            add_dataset(
                user_id=user_id,
                file_name=filename,
                title=title,
                category=category,
            )

            # After the uploading, the increment the counter of uploads for user
            user = get_user_by_id(user_id)
            update_user_dataset_counter(user)

            response_object["message"] = f"{title} has been uploaded by {user_id}"
            return response_object, 201


datasets_namespace.add_resource(Dataset, "/<int:dataset_id>")
datasets_namespace.add_resource(DatasetList, "")
datasets_namespace.add_resource(DatasetListCategory, "/category/<string:category_name>")
datasets_namespace.add_resource(CategoryList, "/category")
datasets_namespace.add_resource(DatasetRating, "/vote/<int:dataset_id>")
datasets_namespace.add_resource(DatasetListTrendingDays, "/trending/<int:days>")
datasets_namespace.add_resource(DatasetListTrendingByDownload, "/trending/download")
datasets_namespace.add_resource(DatasetListTrending, "/trending/all")
datasets_namespace.add_resource(DatasetUpload, "/upload")
datasets_namespace.add_resource(DatasetRetrieve, "/download/<string:filename>")
