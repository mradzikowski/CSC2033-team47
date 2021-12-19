from datetime import date, timedelta
from typing import List, Union

from sqlalchemy import desc
from src import db
from src.api.models import Category, Dataset


def add_dataset(user_id: int, file_name: str, title: str, category: str) -> Dataset:
    dataset = Dataset(
        user_id=user_id,
        file_name=file_name,
        title=title,
        category=category,
    )
    db.session.add(dataset)
    db.session.commit()
    return dataset


def get_all_datasets() -> Union[List[Dataset], None]:
    return Dataset.query.all()


def get_dataset_by_id(dataset_id: int) -> Dataset:
    return Dataset.query.filter_by(dataset_id=dataset_id).first()


def get_datasets_by_category(category: str) -> Union[List[Dataset], None]:
    return Dataset.query.filter_by(category=category).all()


def get_dataset_by_title(title: str) -> Union[List[Dataset], None]:
    return Dataset.query.filter_by(title=title).all()


def get_dataset_by_filename(file_name: str) -> Union[List[Dataset], None]:
    return Dataset.query.filter_by(file_name=file_name).all()


def get_datasets_for_user(user_id: int) -> Union[List[Dataset], None]:
    return Dataset.query.filter_by(user_id=user_id).all()


def get_categories() -> Union[List[Category], None]:
    return Category.query.all()


def increment_dataset_download_counter(dataset: Dataset):
    dataset.download_counter += 1
    db.session.commit()


def increment_dataset_ranking(dataset_id: int) -> Dataset:
    dataset = get_dataset_by_id(dataset_id)
    dataset.rating += 1
    db.session.commit()
    return dataset


def get_trending_datasets_by_days(days: int) -> Union[List[Dataset], None]:
    start_range = date.today() + timedelta(days=days)
    end_range = date.today()
    return (
        Dataset.query.filter(Dataset.date_created.between(start_range, end_range))
        .order_by(desc(Dataset.rating))
        .all()
    )


def get_trending_datasets_today() -> Union[List[Dataset], None]:
    start_range = date.today()
    end_range = date.today() + timedelta(days=1)
    return (
        Dataset.query.filter(Dataset.date_created.between(start_range, end_range))
        .order_by(desc(Dataset.rating))
        .all()
    )


def get_trending_datasets_whole_time() -> Union[List[Dataset], None]:
    return Dataset.query.order_by(desc(Dataset.rating)).all()
