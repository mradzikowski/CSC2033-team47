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
