import pytest
from src import create_app, db
from src.api.crud.crud_users import get_user_by_id, update_user_dataset_counter
from src.api.models import Category, Dataset, User, WorldCountsData


@pytest.fixture(scope="function")
def add_user():
    """
    Pytest fixture to add user during the test

    :return: callable to add user
    """

    def _add_user(
        username: str,
        email: str,
        password: str,
        subscribed: bool = False,
    ) -> User:
        user = User(
            username=username,
            email=email,
            password=password,
            subscribed=subscribed,
        )
        db.session.add(user)
        db.session.commit()
        return user

    return _add_user


@pytest.fixture(scope="function")
def add_dataset():
    """
    Pytest fixture to add dataset during the test

    :return: callable to add dataset
    """

    def _add_dataset(
        user_id: int,
        file_name: str,
        category: str,
        title: str,
        rating: int = 0,
        download_counter: int = 0,
    ) -> Dataset:
        user = get_user_by_id(user_id)
        if user:
            update_user_dataset_counter(user)

        dataset = Dataset(
            user_id=user_id,
            file_name=file_name,
            category=category,
            title=title,
            rating=rating,
            download_counter=download_counter,
        )
        db.session.add(dataset)
        db.session.commit()
        return dataset

    return _add_dataset


@pytest.fixture(scope="function")
def add_category():
    """
    Pytest fixture to add category during the test

    :return: callable to add category
    """

    def _add_category(category_name: str) -> Category:
        category = Category(
            category_name=category_name,
        )
        db.session.add(category)
        db.session.commit()
        return category

    return _add_category


@pytest.fixture(scope="function")
def add_climate_data():
    def _add_climate_data(
        world_average_temperature="0",
        tons_of_co2="0",
        co2_concentration="0",
        tons_of_melted_ice="0",
        rise_in_sea_levels_in_cm="0",
        cost_of_not_acting_on_climate_change="0",
        energy_used="0",
        solar_energy_striking_earth="0",
        electricity_used="0",
        percent_electricity_produced_from_renewable_sources="0",
        time_left_to_the_end_of_oil="",
    ):
        climate_data = WorldCountsData(
            tons_of_co2,
            co2_concentration,
            world_average_temperature,
            tons_of_melted_ice,
            rise_in_sea_levels_in_cm,
            cost_of_not_acting_on_climate_change,
            energy_used,
            solar_energy_striking_earth,
            electricity_used,
            percent_electricity_produced_from_renewable_sources,
            time_left_to_the_end_of_oil,
        )
        db.session.add(climate_data)
        db.session.commit()
        return climate_data

    return _add_climate_data


@pytest.fixture(scope="module")
def test_app():
    """
    Pytest fixture to yield flask test app in flask context

    :return:
    """
    app = create_app()
    app.config.from_object("src.config.TestingConfig")
    with app.app_context():
        yield app


@pytest.fixture(scope="module")
def test_database():
    """
    Pytest fixture to yield database during tests

    :return:
    """
    db.create_all()
    yield db
    db.session.remove()
    db.drop_all()
