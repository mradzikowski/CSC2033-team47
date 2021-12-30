import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const DatasetsList = (props) => {
  return (
    <div>
      {props.datasets.map((dataset) => {
        return (
          <Box
            key={dataset.dataset_id}
            sx={{ display: "grid" }}
            className="box is-3 dataset"
            variant="outlined"
          >
            <Box>
              <strong>Filename:</strong>&nbsp;
              {dataset.file_name}
            </Box>

            <br />
            <Box>
              <strong>Title:</strong>&nbsp;
              <span data-testid="dataset-title">{dataset.title}</span>
            </Box>

            <br />
            <Box>
              <strong>Category:</strong>&nbsp;
              <span data-testid="dataset-category">{dataset.category}</span>
            </Box>

            <Box>
              <Button
                name={dataset.file_name}
                onClick={props.handleClick}
                variant="contained"
              >
                Download
              </Button>
            </Box>
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
