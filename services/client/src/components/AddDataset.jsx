import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const AddDataset = (props) => {
  return (
      <Paper elevation={10} className='upload-container'>
        <form style={{padding: '20px'}}>
          <div className="upload-title">
            Upload Your Dataset
          </div>
          <div className="upload-field">
            <TextField
              type="file"
              name="file_name"
              className="form-control"
              onChange={props.handleChange}
              style={{width: '100%'}}
            />
          </div>
          <div>
            <div className="upload-field">
              <TextField
                id="outlined-basic"
                name="title"
                onChange={props.handleChange}
                variant="standard"
                label="Title"
                style={{width: '100%'}}
              />
            </div>
            <div className="upload-field">
              <TextField
                id="outlined-basic"
                name="category"
                onChange={props.handleChange}
                variant="standard"
                label="Category"
                style={{width: '100%'}}
              />
            </div>
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
  );
};

AddDataset.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default AddDataset;
