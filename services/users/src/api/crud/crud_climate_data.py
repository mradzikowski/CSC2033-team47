import time
from datetime import date, timedelta
from bs4 import BeautifulSoup
from helium import kill_browser, start_firefox
from src import db
from src.api.models import WorldCountsData, NasaData


# Retrieve data from https://www.theworldcounts.com/challenges/climate-change
def add_world_counts_data():
    url = "https://www.theworldcounts.com/challenges/climate-change"
    browser = start_firefox(url, headless=True)
    time.sleep(1)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    counters = soup.find_all("p", {"class": "counter"})

    counters = [counter.text for counter in counters]
    print(counters)

    if "Loading ..." not in counters:
        climate_data = WorldCountsData(*counters)
        print(climate_data)

        db.session.add(climate_data)
        db.session.commit()
        kill_browser()
        return climate_data
    else:
        return None


# Retrieve data from https://climate.nasa.gov/
def add_nasa_climate_data():
    url = "https://climate.nasa.gov"
    browser = start_firefox(url, headless=True)
    time.sleep(1)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    # Get the first 6 div tags with the class change_number
    vitals = soup.find_all("div", {"class": "change_number"}, limit=6)

    vitals = [vital.text.strip() for vital in vitals]
    print(vitals)

    # Vitals corresponding meaning (as of time of writing)
    # [0] - Arctic Sea Ice Extent (Percent per decade since 1979)(Down Arrow)
    # [1] - Ice Sheets (Billion metric tons per year)(Down Arrow)
    # [2] - Sea Level (Millimeters per year)(Up Arrow)
    # [3] - Ocean Heat Added (Zettajoules since 1955)(Up Arrow)
    # [4] - Carbon Dioxide (Parts per million (current))(Up Arrow)
    # [5] - Global Temperature (Degrees centigrade since 1880)(Up Arrow)

    if "Loading ..." not in vitals:
        climate_data = NasaData(*vitals)
        print(climate_data)

        db.session.add(climate_data)
        db.session.commit()
        kill_browser()
        return climate_data
    else:
        return None


# Retrieve data from https://www.bloomberg.com/graphics/climate-change-data-green/
def add_bloomberg_data():
    url = "https://www.bloomberg.com/graphics/climate-change-data-green/"
    browser = start_firefox(url, headless=True)
    time.sleep(1)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    # Get div elements
    # Ignore values 0 and 4
    data = soup.find_all("div", {"class": "number"})
    # Ignore values 0 and 4 as not needed
    data.pop(4)
    data.pop(0)
    # Convert values to text form
    data = [datum.text for datum in data]

    # For dev purposes
    for datum in data:
        print(datum)

    # Data corresponding meaning (as of time of writing)
    # [0] - Million metric tons of greenhouse emissions, most recent annual data
    # [1] - November 2021 increase in global temperature vs 1900s average
    # [2] - Today's arctic ice area vs. historic average
    # [3] - Carbon-free net power in the United States, most recent data
    # [4] - Renewable power investment worldwide in Q2 2020
    kill_browser()

    return data


def get_world_counts_data_today():
    start_range = date.today()
    end_range = date.today() + timedelta(days=1)
    climate_data = WorldCountsData.query.filter(
        WorldCountsData.date_created.between(start_range, end_range),
    ).all()
    if len(climate_data) == 0:
        climate_data = add_world_counts_data()
        if climate_data:
            return climate_data
        else:
            return False
    else:
        return climate_data



