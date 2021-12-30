import React from "react";
import PropTypes from "prop-types";

const CategoryList = (props) => {
  return (
    <div>
      {props.categories.map((category) => {
        return (
          <p
            key={category.category_name}
            className="box title is-4 category_name"
          >
            {category.category_name}
          </p>
        );
      })}
    </div>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default CategoryList;
