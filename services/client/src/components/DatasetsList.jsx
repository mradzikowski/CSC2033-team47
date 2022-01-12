import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";

class DatasetsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
    };
  }

  componentDidMount() {
    this.getDatasetList();
  }

  getDatasetList() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets`)
      .then((res) => {
        this.setState({ datasets: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleUpVoteSubmit = (dataset_id) => {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/vote`.concat(
        "/",
        dataset_id
      ),
      method: "post",
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    };
    axios(options)
      .then((res) => {
        console.log(res);
        this.getDatasetList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.props.isAuthenticated()) {
      return (
        <Box className="datasets-list">
          {this.state.datasets.map((dataset) => {
            return (
              <Box key={dataset.dataset_id} className="dataset-container">
                <Paper
                  key={dataset.dataset_id}
                  className="dataset"
                  sx={{ display: "grid" }}
                  elevation={10}
                >
                  <div className="dataset-item">
                    <strong>Filename:</strong>
                    {dataset.file_name}
                  </div>
                  <div className="dataset-item">
                    <strong>Title:</strong>
                    <span data-testid="dataset-title">{dataset.title}</span>
                  </div>
                  <div className="dataset-item">
                    <strong>Category:</strong>
                    <span data-testid="dataset-category">
                      {dataset.category}
                    </span>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Button
                      style={{
                        display: "inline-block",
                        float: "left",
                        width: "10%",
                        transform: "translate(0, 5%)",
                      }}
                      onClick={
                        (event) => this.handleUpVoteSubmit(dataset.dataset_id)
                        // eslint-disable-next-line react/jsx-curly-newline
                      }
                    >
                      <ThumbUpIcon />
                      {dataset.rating}
                    </Button>
                    <Button
                      style={{
                        display: "inline-block",
                        float: "left",
                        width: "90%",
                      }}
                      sx={{ backgroundColor: "black" }}
                      name={dataset.file_name}
                      onClick={this.props.handleClick}
                      variant="contained"
                    >
                      Download
                    </Button>
                  </div>
                </Paper>
                <br />
              </Box>
            );
          })}
        </Box>
      );
    } else {
      return (
        <Box className="datasets-list">
          {this.state.datasets.map((dataset) => {
            return (
              <Box key={dataset.dataset_id} className="dataset-container">
                <Paper
                  key={dataset.dataset_id}
                  className="dataset"
                  sx={{ display: "grid" }}
                  elevation={10}
                >
                  <div className="dataset-item">
                    <strong>Filename:</strong>&nbsp;
                    {dataset.file_name}
                  </div>
                  <div className="dataset-item">
                    <strong>Title:</strong>&nbsp;
                    <span data-testid="dataset-title">{dataset.title}</span>
                  </div>
                  <div className="dataset-item">
                    <strong>Category:</strong>&nbsp;
                    <span data-testid="dataset-category">
                      {dataset.category}
                    </span>
                  </div>
                  <Button
                    sx={{ backgroundColor: "black" }}
                    name={dataset.file_name}
                    onClick={this.props.handleClick}
                    variant="contained"
                  >
                    Download
                  </Button>
                </Paper>
                <br />
              </Box>
            );
          })}
        </Box>
      );
    }
  }
}

DatasetsList.propTypes = {
  isAuthenticated: PropTypes.func.isRequired,
};

export default DatasetsList;
