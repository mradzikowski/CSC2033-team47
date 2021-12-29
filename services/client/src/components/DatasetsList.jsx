import React from "react";
import PropTypes from "prop-types";

const DatasetsList = (props) => {
  return (
    <div>
      {props.datasets.map((dataset) => {
        return (
          <p key={dataset.dataset_id} className="box is-3 dataset">
            <strong>Filename:</strong>&nbsp;
            {dataset.file_name}
            <br />
            <strong>Title:</strong>&nbsp;
            <span data-testid="dataset-title">{dataset.title}</span>
            <br />
            <strong>Category:</strong>&nbsp;
            <span data-testid="dataset-category">{dataset.category}</span>
          </p>
        );
      })}
    </div>
  );
};

DatasetsList.propTypes = {
  datasets: PropTypes.array.isRequired,
};

export default DatasetsList;
