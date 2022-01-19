import React, { Component } from "react";
import { useHistory, withRouter } from "react-router-dom";
import Select from "react-select";
import Button from "@mui/material/Button";


// Main component for the search bar on the landing page.
// Contains functions to get possible categories from the API and to pass the search query.

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      query: null,
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

  handleChange = (e) => {
    this.setState({ query: e });
  };

  render() {
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <div style={{ display: "block" }}>
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <Select
          isMulti
          isClearable
          isSearchable={false}
          options={this.state.categories}
          className="searchBar"
          onChange={(e) => this.handleChange(e)}
          placeholder="Select Dataset Categories"
        />
        {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <Button
          className="searchButton"
          sx={{ backgroundColor: "black", height: "35px" }}
          variant="contained"
          onClick={() => this.props.search(this.state.query)}
        >
          Search
        </Button>
      </div>
    );
  }
}

export default withRouter(SearchBar);
