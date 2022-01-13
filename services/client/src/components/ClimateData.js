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

class ClimateData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      worldCounts: [],
      retrieved: false,
    };
  }

  componentDidMount() {

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
        this.setState({ retrieved: true });
      });
  }


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
      .then(() => {
        console.log(this.state.worldCounts);
      });
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

  render() {
    return (
      <Box className="climatedata-list">
        <Box className="climatedata-container" key="">
          <Paper className="climatedata">
            <WbSunnyIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div>
                <strong>{this.props.data["0"].data}</strong>
              </div>
              <div>World Average Temperature (°C)</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container">
          <Paper className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["1"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Tons of CO2 released into the atmosphere</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["2"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Concentration of CO2</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <WaterIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["3"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Tons of melted ice</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <WaterIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>{this.props.data["4"].data}</strong>
              </div>
              <div key="">Rise in sea levels (cm)</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <AttachMoneyIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["5"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Cost of not acting on climate change (US $)</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <BoltIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["6"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Terajoules of energy used</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <WbSunnyIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["7"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Terajoules of solar energy striking earth</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <BoltIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["8"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Terajoules of electricity used</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <BoltIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>{this.props.data["9"].data}</strong>
              </div>
              <div key="">% of electricty produced from renewable sources</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <BoltIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>{this.props.data["10"].data}</strong>
              </div>
              <div key="">Time left till the we run out oil</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>
                  {parseInt(this.props.data["11"].data).toLocaleString("en-US")}
                </strong>
              </div>
              <div key="">Million tons of greenhouse emissions</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>{this.props.data["13"].data}%</strong>
              </div>
              <div key="">Todays artic ice vs historic average</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>{this.props.data["14"].data}%</strong>
              </div>
              <div key="">Carbon-free power in Germany</div>
            </div>
          </Paper>
        </Box>
        <Box className="climatedata-container" key="">
          <Paper key="" className="climatedata">
            <ArrowUpwardIcon
              style={{ position: "relative", top: "10" }}
              className="climatedata-item"
            />
            <div className="climatedata-item">
              <div key="">
                <strong>${this.props.data["15"].data} Billion</strong>
              </div>
              <div key="">Renewable power investments worldwide</div>
            </div>
          </Paper>
        </Box>
      </Box>
    );
  }
}

export default ClimateData;
