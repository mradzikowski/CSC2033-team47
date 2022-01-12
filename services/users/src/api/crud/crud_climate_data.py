import time
from datetime import date, timedelta

import psutil
from bs4 import BeautifulSoup
from helium import kill_browser, start_firefox
from src import db
from src.api.models import BloombergData, NasaData, WorldCountsData

PROCNAMES = ["geckodriver", "Web Content", "firefox-esr"]


def killing_geckodrivers_processes():
    """Helper function to kill the processes after killing the firefox browser"""
    for proc in psutil.process_iter():
        # check whether the process name matches
        for PROCNAME in PROCNAMES:
            if proc.name() == PROCNAME:
                proc.kill()


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
        killing_geckodrivers_processes()
        return climate_data
    else:
        kill_browser()
        killing_geckodrivers_processes()
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
        killing_geckodrivers_processes()
        return climate_data
    else:
        kill_browser()
        killing_geckodrivers_processes()
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
    bloomberg_data_not_cleared = [datum.text for datum in data]

    data_cleared = clearing_bloomberg_data(bloomberg_data_not_cleared)

    # Data corresponding meaning (as of time of writing)
    # [0] - Million metric tons of greenhouse emissions, most recent annual data
    # [1] - November 2021 increase in global temperature vs 1900s average
    # [2] - Today's arctic ice area vs. historic average
    # [3] - Carbon-free net power in the United States, most recent data
    # [4] - Renewable power investment worldwide in Q2 2020
    if "Loading ..." not in data_cleared:
        climate_data = BloombergData(*data_cleared)

        db.session.add(climate_data)
        db.session.commit()
        kill_browser()
        killing_geckodrivers_processes()
        return climate_data
    else:
        kill_browser()
        killing_geckodrivers_processes()
        return None


def get_bloomberg_data_today():
    start_range = date.today()
    end_range = date.today() + timedelta(days=1)
    climate_data = BloombergData.query.filter(
        BloombergData.date_created.between(start_range, end_range),
    ).all()
    if len(climate_data) == 0:
        climate_data = add_bloomberg_data()
        if climate_data:
            return climate_data
        else:
            return False
    else:
        return climate_data


def get_nasa_data_today():
    start_range = date.today()
    end_range = date.today() + timedelta(days=1)
    climate_data = NasaData.query.filter(
        NasaData.date_created.between(start_range, end_range),
    ).all()
    if len(climate_data) == 0:
        climate_data = add_nasa_climate_data()
        if climate_data:
            return climate_data
        else:
            return False
    else:
        return climate_data


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


def clearing_bloomberg_data(bloomberg_data):
    data_before_clearing = [d.split()[0].replace("\u200b", "") for d in bloomberg_data]

    # Clearing the data
    data_cleared = []
    signs = ["°", "%", "$", "B", "+"]
    for row in data_before_clearing:
        for sign in signs:
            if sign in row:
                row = row.replace(sign, "")
        data_cleared.append(row)

    return data_cleared
