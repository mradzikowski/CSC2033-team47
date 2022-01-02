import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const DatasetsList = (props) => {
  return (
    <Box>
      {props.datasets.map((dataset) => {
        return (
          <Box key={dataset.dataset_id}>
            <Paper
              key={dataset.dataset_id}
              className="dataset"
              sx={{ display: "grid" }}
              elevation={10}
            >
              <strong>Filename:</strong>&nbsp;
              {dataset.file_name}
              <strong>Title:</strong>&nbsp;
              <span data-testid="dataset-title">{dataset.title}</span>
              <strong>Category:</strong>&nbsp;
              <span data-testid="dataset-category">{dataset.category}</span>
              <Button
                name={dataset.file_name}
                onClick={props.handleClick}
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
};

DatasetsList.propTypes = {
  datasets: PropTypes.array.isRequired,
};

export default DatasetsList;
