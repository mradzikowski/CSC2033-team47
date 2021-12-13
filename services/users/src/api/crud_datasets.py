from src import db
from src.api.models import Category, Dataset


def add_dataset(user_id, file_name, title, category):
    dataset = Dataset(
        user_id=user_id,
        file_name=file_name,
        title=title,
        category=category,
    )
    db.session.add(dataset)
    db.session.commit()
    return dataset


def get_all_datasets():
    return Dataset.query.all()


def get_dataset_by_id(dataset_id):
    return Dataset.query.filter_by(dataset_id=dataset_id).first()


def get_datasets_by_category(category):
    return Dataset.query.filter_by(category=category).all()


def get_dataset_by_title(title):
    return Dataset.query.filter_by(title=title).all()


def get_datasets_for_user(user_id):
    return Dataset.query.filter_by(user_id=user_id).all()


def get_categories():
    return Category.query.all()


def increment_dataset_ranking(dataset_id):
    dataset = get_dataset_by_id(dataset_id)
    dataset.rating += 1
    db.session.commit()
    return dataset
