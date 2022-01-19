import React, { state, setState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";


// Main component for the nasa data bar (displayed at the bottom of the news page.)
// Contains functions for getting the data and displaying it on success.

class NasaData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      retrieved: false,
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/climatedata/nasa`)
      .then((res) => res.json())
      .then((values) => {
        let nasa = [];

        for (let key in values[0]) {
          if (key != "id") nasa.push({ title: key, data: values[0][key] });
        }

        this.setState({ data: nasa });
        this.setState({ retrieved: true });
      });
  }

  render() {
    if (this.state.retrieved) {
      return (
        <div className="nasa-data-bar">
          <div className="nasa-data-container">
            <div className="nasa-data-title">Artic Ice</div>
            <div className="nasa-data-value">
              <ArrowDownwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["0"].data}% / decade
            </div>
          </div>
          <div className="nasa-data-container">
            <div className="nasa-data-title">Ice Sheets</div>
            <div className="nasa-data-value">
              <ArrowDownwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["1"].data} billion tons / year
            </div>
          </div>
          <div className="nasa-data-container">
            <div className="nasa-data-title">Sea Level</div>
            <div className="nasa-data-value">
              <ArrowUpwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["2"].data} millimetres / year
            </div>
          </div>
          <div className="nasa-data-container">
            <div className="nasa-data-title">Ocean Heat Added</div>
            <div className="nasa-data-value">
              <ArrowUpwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["3"].data} zettajoules since 1955
            </div>
          </div>
          <div className="nasa-data-container">
            <div className="nasa-data-title">Carbon Dioxide</div>
            <div className="nasa-data-value">
              <ArrowUpwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["4"].data} parts per million
            </div>
          </div>
          <div className="nasa-data-container">
            <div className="nasa-data-title">Global Temperature</div>
            <div className="nasa-data-value">
              <ArrowUpwardIcon
                style={{
                  position: "relative",
                  transform: "translate(0, 20%)",
                  marginRight: "-5px",
                }}
              />{" "}
              {this.state.data["4"].data}°C since 1880
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="nasa-data-bar" />;
    }
  }
}

export default NasaData;
