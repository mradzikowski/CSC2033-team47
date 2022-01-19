import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

class AddDataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      uploaded: false,
      category: null,
      title: null,
      file_name: null,
      failed: false,
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/category`)
      .then((res) => res.json())
      .then((data) => {
        let tempArray = [];
        for (let c of data) {
          tempArray.push({
            value: Object.values(c)[0],
            label: Object.values(c)[0],
          });
        }
        this.setState({ categories: tempArray });
      })
      .then(() => {});
  }

  handleUpload = (event) => {
    event.preventDefault();
    let formData = new FormData();

    formData.append("file", this.state.file_name);
    formData.append("title", this.state.title);
    formData.append("category", this.state.category);

    axios
      .post(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.props.accessToken}`,
          },
        }
      )
      .then((res) => {
        if (res.statusText == "CREATED") {
          this.setState({ uploaded: true });
        } else {
          this.setState({ failed: true });
        }
      })
      .catch((err) => this.setState({ failed: true }));
  };

  getStyles = () => {
    return {
      option: (provided, state) => ({
        ...provided,
        padding: 20,
        fontSize: "15px",
        backgroundColor: state.isSelected ? "grey" : "white",
      }),
      control: () => ({
        // none of react-select's styles are passed to <Control />
        textAlign: "left",
        fontSize: "15px",
        border: "solid",
        borderRadius: "10px",
        borderWidth: "1px",
        width: "100%",
        display: "flex",
        marginBottom: 20,
        marginTop: 20,
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";

        return { ...provided, opacity, transition };
      },
    };
  };

  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }

    if (this.state.uploaded) {
      return <Redirect to="/datasets" />;
    }

    return (
      <Paper elevation={10} className="upload-container">
        <form style={{ padding: "20px" }}>
          <div className="upload-title">Upload Your Dataset</div>
          <div className="upload-field">
            <TextField
              type="file"
              name="file_name"
              className="form-control"
              onChange={(e) => {
                this.setState({ file_name: event.target.files[0] });
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <div className="upload-field">
              <TextField
                id="outlined-basic"
                name="title"
                onChange={(e) => {
                  this.setState({ title: e.target.value });
                }}
                variant="standard"
                label="Title"
                style={{ width: "100%" }}
              />
            </div>
            <Select
              name="category"
              isClearable
              isSearchable={false}
              options={this.state.categories}
              onChange={(e) => {
                if (e != null) this.setState({ category: e.label });
                else this.setState({ category: null });
              }}
              placeholder="Category"
              styles={this.getStyles()}
            />
            <Button
              type="submit"
              className="btn btn-success btn-block"
              onClick={this.handleUpload}
              variant="contained"
            >
              Upload
            </Button>
            <Error failed={this.state.failed} />
          </div>
        </form>
      </Paper>
    );
  }
}

const Error = (props) => {
  if (props.failed) {
    return (
      <div style={{ fontSize: "small", color: "red" }}>
        failed, please try again
      </div>
    );
  } else {
    return <div />;
  }
};

AddDataset.propTypes = {
  // handleSelectChange: PropTypes.func.isRequired,
  // handleChange: PropTypes.func.isRequired,
  // handleClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
};

export default AddDataset;
