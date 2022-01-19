import React from "react";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";


// Unused component that displayed all possible categories

const CategoryList = (props) => {
  return (
    <Box>
      {props.categories.map((category) => {
        return (
          <Box key={category.category_name}>
            <Paper elevation={10} className="category_name">
              {category.category_name}
            </Paper>
            <br />
          </Box>
        );
      })}
    </Box>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default CategoryList;
