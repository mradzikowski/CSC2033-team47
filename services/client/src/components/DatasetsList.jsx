import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const DatasetsList = (props) => {
  return (
    <div className="datasets-list">
      {props.datasets.map((dataset) => {
        return (
          <Box key={dataset.dataset_id} className='dataset-item'>
            <Paper
              key={dataset.dataset_id}
              className="dataset"
              sx={{ display: "grid", width: '100%'}}
              elevation={10}
            >
              <div style={{display: 'inline-block', padding: '5px'}}>
                <strong>Filename:</strong> {dataset.file_name}&nbsp;
              </div>
              <div style={{display: 'inline-block', padding: '5px'}}>
                <strong>Title:</strong>&nbsp;
                <span data-testid="dataset-title">{dataset.title}</span>
              </div>
              <div style={{display: 'inline-block', padding: '5px'}}>
                <strong>Category:</strong>&nbsp;
                <span data-testid="dataset-category">{dataset.category}</span>
              </div>
              <Button
                name={dataset.file_name}
                onClick={props.handleClick}
                variant="contained"
                style={{backgroundColor: 'black'}}
              >
                Download
              </Button>
            </Paper>
            <br />
          </Box>
        );
      })}
    </div>
  );
};

DatasetsList.propTypes = {
  datasets: PropTypes.array.isRequired,
};

export default DatasetsList;
