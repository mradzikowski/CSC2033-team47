from sqlalchemy.sql import func
from src import db
from werkzeug.security import generate_password_hash


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    twitter_link = db.Column(db.String(256), nullable=True)
    datasets = db.relationship("Dataset", backref="user", lazy=True)
    dataset_upload_counter = db.Column(db.Integer, default=0)
    subscribed = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(
        self,
        username="",
        email="",
        password="",
        twitter_link="",
        subscribed=False,
    ):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.twitter_link = twitter_link
        self.dataset_upload_counter = 0
        self.subscribed = subscribed


class Dataset(db.Model):
    __tablename__ = "datasets"

    dataset_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="cascade"))
    file_name = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    category = db.Column(
        db.String(256),
        db.ForeignKey("categories.category_name", ondelete="cascade"),
    )
    file_type = db.Column(db.String(128), nullable=False)
    rating = db.Column(db.Integer, default=0)
    download_counter = db.Column(db.Integer, default=0)
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(
        self,
        user_id,
        file_name,
        category,
        title,
        rating=0,
        download_counter=0,
    ):
        self.user_id = user_id
        self.file_name = file_name
        self.title = title
        self.category = category
        self.file_type = file_name.split(".", 0)[0].lower()
        self.rating = rating
        self.download_counter = download_counter


class Category(db.Model):
    __tablename__ = "categories"

    category_name = db.Column(db.String(256), primary_key=True)
    datasets = db.relationship("Dataset", backref="category_name", lazy=True)


class NasaData(db.Model):
    __tablename__ = "nasadata"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    down_arctic_ice_percent = db.Column(db.Float, default=0)
    down_ice_sheets_tons = db.Column(db.Integer, default=0)
    up_sea_level = db.Column(db.Float, default=0)
    up_ocean_heat = db.Column(db.Integer, default=0)
    up_carbon_dioxide = db.Column(db.Integer, default=0)
    up_global_temperature = db.Column(db.Float, default=0)

    def __init__(
        self,
        down_arctic_ice_percent="0",
        down_ice_sheet_tons="0",
        up_sea_level="0",
        up_ocean_heat="0",
        up_carbon_dioxide="0",
        up_global_temperature="0"
    ):

        self.down_arctic_ice_percent = down_arctic_ice_percent
        self.down_ice_sheets_tons = down_ice_sheet_tons
        self.up_sea_level = up_sea_level
        self.up_ocean_heat = up_ocean_heat
        self.up_carbon_dioxide = up_carbon_dioxide
        self.up_global_temperature = up_global_temperature


class WorldCountsData(db.Model):
    __tablename__ = "worldcountsdata"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    tons_of_co2 = db.Column(db.BigInteger, default=0)
    world_average_temperature = db.Column(db.Float, default=0)
    tons_of_melted_ice = db.Column(db.BigInteger, default=0)
    rise_in_sea_levels_in_cm = db.Column(db.Float, default=0)
    cost_of_not_acting_on_climate_change = db.Column(db.BigInteger, default=0)
    energy_used = db.Column(db.BigInteger, default=0)
    solar_energy_striking_earth = db.Column(db.BigInteger, default=0)
    electricity_used = db.Column(db.BigInteger, default=0)
    percent_electricity_produced_from_renewable_sources = db.Column(db.Float, default=0)
    time_left_to_the_end_of_oil = db.Column(db.String(128), default="")
    date_created = db.Column(db.DateTime, default=func.now())

    def __init__(
        self,
        tons_of_co2="0",
        world_average_temperature="0",
        tons_of_melted_ice="0",
        rise_in_sea_levels_in_cm="0",
        cost_of_not_acting_on_climate_change="0",
        energy_used="0",
        solar_energy_striking_earth="0",
        electricity_used="0",
        percent_electricity_produced_from_renewable_sources="0",
        time_left_to_the_end_of_oil="",
    ):
        self.tons_of_co2 = self.replace_string_to_number(tons_of_co2, ",")
        self.world_average_temperature = self.replace_string_to_number(
            world_average_temperature,
            ".",
        )
        self.tons_of_melted_ice = self.replace_string_to_number(tons_of_melted_ice, ",")
        self.rise_in_sea_levels_in_cm = self.replace_string_to_number(
            rise_in_sea_levels_in_cm,
            ".",
        )
        self.cost_of_not_acting_on_climate_change = self.replace_string_to_number(
            cost_of_not_acting_on_climate_change,
            ",",
        )
        self.energy_used = self.replace_string_to_number(energy_used, ",")
        self.solar_energy_striking_earth = self.replace_string_to_number(
            solar_energy_striking_earth,
            ",",
        )
        self.electricity_used = self.replace_string_to_number(electricity_used, ",")
        self.percent_electricity_produced_from_renewable_sources = (
            self.replace_string_to_number(
                percent_electricity_produced_from_renewable_sources,
                ".",
            )
        )
        self.time_left_to_the_end_of_oil = time_left_to_the_end_of_oil

    @staticmethod
    def replace_string_to_number(word: str, punctuation: str):
        word = word.strip()
        if punctuation == ".":
            return round(float(word), 4)
        else:
            return int(word.replace(punctuation, ""))
