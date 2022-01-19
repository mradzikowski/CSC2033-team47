import React, { state, setState } from "react";
import NasaData from "./NasaData";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import WaterIcon from "@mui/icons-material/Water";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import PercentIcon from "@mui/icons-material/Percent";


// Main component for the Data page.
// Contains functions for getting world counter data from the API and renders depending on successful retrieval


class ClimateData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      worldCounts: [],
      retrieved: false,
    };
  }

  componentDidMount() {
    this.getCounterData();
  }

  getCounterData() {
    // Get World Counts
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/climatedata/worldcounts`)
      .then((res) => res.json())
      .then((values) => {
        let worldCounts = [];

        for (let key in values[0]) {
          if (key != "id")
            worldCounts.push({ title: key, data: values[0][key] });
        }

        this.setState({ worldCounts: worldCounts });
      })
      .then(() => this.getBloomberg())
      .then(() => {});
  }

  getBloomberg() {
    // Get World Counts
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/climatedata/bloomberg`)
      .then((res) => res.json())
      .then((values) => {
        let worldCounts = this.state.worldCounts;

        for (let key in values[0]) {
          if (key != "id")
            worldCounts.push({ title: key, data: values[0][key] });
        }

        this.setState({ worldCounts: worldCounts });
        this.setState({ retrieved: true });
      });
  }

  render() {
    if (this.state.retrieved) {
      return (
        <div>
          <CounterData data={this.state.worldCounts} />
          <NasaData />
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }
}

class CounterData extends React.Component {
  constructor(props) {
    super(props);
  }

  getInfo = (d) => {
    let info = { data: d.data };

    // Get and data
    if (
      ["tons_of_co2", "co2_concentration", "greenhouse_emissions"].indexOf(
        d.title
      ) >= 0
    ) {
      info["icon"] = (
        <ArrowUpwardIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = parseInt(d.data).toLocaleString("en-US");
    } else if (["solar_energy_striking_earth"].indexOf(d.title) >= 0) {
      info["icon"] = (
        <WbSunnyIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = `${parseInt(d.data).toLocaleString("en-US")} Terajoules`;
    } else if (["world_average_temperature"].indexOf(d.title) >= 0) {
      info["icon"] = (
        <ThermostatIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = `${d.data}°C`;
    } else if (
      ["tons_of_melted_ice", "rise_in_sea_levels_in_cm"].indexOf(d.title) >= 0
    ) {
      info["icon"] = (
        <WaterIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = parseInt(d.data).toLocaleString("en-US");
    } else if (
      [
        "cost_of_not_acting_on_climate_change",
        "renewable_power_investments",
      ].indexOf(d.title) >= 0
    ) {
      info["icon"] = (
        <AttachMoneyIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      if (d.title == "renewable_power_investments")
        info["data"] = `$${d.data} Billion`;
      else info["data"] = `$${parseInt(d.data).toLocaleString("en-US")}`;
    } else if (["energy_used", "electricity_used"].indexOf(d.title) >= 0) {
      info["icon"] = (
        <BoltIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = `${parseInt(d.data).toLocaleString("en-US")} Terajoules`;
    } else if (["time_left_to_the_end_of_oil"].indexOf(d.title) >= 0) {
      info["icon"] = (
        <AccessTimeIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
    } else if (
      [
        "carbon_free_power",
        "percent_electricity_produced_from_renewable_sources",
        "today_arctic_ice",
      ].indexOf(d.title) >= 0
    ) {
      info["icon"] = (
        <PercentIcon
          key={`${d.title}.3`}
          style={{ position: "relative", top: "10" }}
          className="climatedata-item"
        />
      );
      info["data"] = `${d.data}%`;
    }

    // get label
    if (d.title == "tons_of_co2")
      info["label"] = "Tons of CO2 released into the atmosphere";
    else if (d.title == "rise_in_sea_levels_in_cm")
      info["label"] = "Rise in sea levels (cm)";
    else if (d.title == "percent_electricity_produced_from_renewable_source")
      info["label"] = "Electricty produced from renewable sources";
    else if (d.title == "time_left_to_the_end_of_oil")
      info["label"] = "Time left till the we run out oil";
    else if (d.title == "greenhouse_emissions")
      info["label"] = "Million tons of greenhouse emissions";
    else if (d.title == "today_arctic_ice")
      info["label"] = "Todays artic ice vs historic average";
    else if (d.title == "carbon_free_power")
      info["label"] = "Carbon-free power in Germany";
    else if (d.title == "renewable_power_investments")
      info["label"] = "Renewable power investments worldwide";
    else {
      let label = d.title.split("_").join(" ");
      label = label.charAt(0).toUpperCase() + label.slice(1);
      info["label"] = label;
    }

    return info;
  };

  render() {
    return (
      <Box className="climatedata-list">
        {this.props.data.map((d) => {
          if (d.title == "nov_increase_temp") return;
          let info = this.getInfo(d);
          return (
            <Box className="climatedata-container" key={`${d.title}.1`}>
              <Paper className="climatedata" key={`${d.title}.2`}>
                {info.icon}
                <div className="climatedata-item">
                  <div key="">
                    <strong>
                      {/* {parseInt(this.props.data["0"].data).toLocaleString("en-US")} */}
                      {info.data}
                    </strong>
                  </div>
                  <div key="">{info.label}</div>
                </div>
              </Paper>
            </Box>
          );
        })}
      </Box>
    );
  }
}

export default ClimateData;
