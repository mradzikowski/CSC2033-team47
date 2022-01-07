import time
from datetime import date, timedelta

from bs4 import BeautifulSoup
from helium import kill_browser, start_firefox
from src import db
from src.api.models import ClimateData

def add_climate_data():
    url = "https://www.theworldcounts.com/challenges/climate-change"
    browser = start_firefox(url, headless=True)
    time.sleep(1)
    soup = BeautifulSoup(browser.page_source, "html.parser")

    counters = soup.find_all("p", {"class": "counter"})

    counters = [counter.text for counter in counters]
    print(counters)
    if "Loading ..." not in counters:
        climate_data = ClimateData(*counters)
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

    vitals = soup.find_all("div", {"class": "change_number"}, limit=6)

    vitals = [vital.text for vital in vitals]

    print(vitals)
    return vitals

    # Vitals corresponding meaning
    # [0] - Arctic Sea Ice Extent (Percent per decade since 1979)(Down Arrow)
    # [1] - Ice Sheets (Billion metric tons per year)(Down Arrow)
    # [2] - Sea Level (Millimeters per year)(Up Arrow)
    # [3] - Ocean Heat Added (Zettajoules since 1955)(Up Arrow)
    # [4] - Carbon Dioxide (Parts per million (current))(Up Arrow)
    # [5] - Global Temperature (Degrees centigrade since 1880)(Up Arrow)


def get_climate_data_today():
    start_range = date.today()
    end_range = date.today() + timedelta(days=1)
    climate_data = ClimateData.query.filter(
        ClimateData.date_created.between(start_range, end_range),
    ).all()
    if len(climate_data) == 0:
        climate_data = add_climate_data()
        if climate_data:
            return climate_data
        else:
            return False
    else:
        return climate_data



