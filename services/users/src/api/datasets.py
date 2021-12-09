from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Api, Resource, fields
from src.api.crud_datasets import add_dataset, get_all_datasets
from werkzeug.utils import secure_filename

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


class DatasetList(Resource):
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

            add_dataset(user_id, filename, title, category)

            response_object["message"] = f"{title} has been uploaded by {user_id}"
            return response_object, 201


class Dataset(Resource):
    def get(self):
        pass


api.add_resource(Dataset, "/datasets/<int:dataset_id>")
api.add_resource(DatasetList, "/datasets")
