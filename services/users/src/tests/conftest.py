import pytest
from src import create_app, db
from src.api.crud_users import get_user_by_id, update_user_dataset_counter
from src.api.models import Category, Dataset, User


@pytest.fixture(scope="function")
def add_user():
    def _add_user(username, email, password):
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return user

    return _add_user


@pytest.fixture(scope="function")
def add_dataset():
    def _add_dataset(user_id, file_name, category, title, rating=0):
        user = get_user_by_id(user_id)
        update_user_dataset_counter(user)

        dataset = Dataset(
            user_id=user_id,
            file_name=file_name,
            category=category,
            title=title,
            rating=rating,
        )
        db.session.add(dataset)
        db.session.commit()
        return dataset

    return _add_dataset


@pytest.fixture(scope="function")
def add_category():
    def _add_category(category_name):
        category = Category(
            category_name=category_name,
        )
        db.session.add(category)
        db.session.commit()
        return category

    return _add_category


@pytest.fixture(scope="module")
def test_app():
    app = create_app()
    app.config.from_object("src.config.TestingConfig")
    with app.app_context():
        yield app


@pytest.fixture(scope="module")
def test_database():
    db.create_all()
    yield db
    db.session.remove()
    db.drop_all()
