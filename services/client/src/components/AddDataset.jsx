import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const AddDataset = (props) => {
  return (
    <div className="col-md-6">
      <Paper elevation={10}>
        <form>
          <div className="form-group files">
            <label>Upload Your Dataset </label>
            <TextField
              type="file"
              name="file_name"
              className="form-control"
              onChange={props.handleChange}
            />
          </div>
          <br />
          <div>
            <div>
              <TextField
                id="outlined-basic"
                name="title"
                onChange={props.handleChange}
                variant="outlined"
                label="Title"
              />
            </div>
            <hr />
            <div>
              <TextField
                id="outlined-basic"
                name="category"
                onChange={props.handleChange}
                variant="outlined"
                label="Category"
              />
            </div>
            <hr />
            <Button
              type="submit"
              className="btn btn-success btn-block"
              onClick={props.handleClick}
              variant="contained"
            >
              Upload
            </Button>
          </div>
        </form>
      </Paper>
      <br />
    </div>
  );
};

AddDataset.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default AddDataset;
