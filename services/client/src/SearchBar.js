import React, { state, setState, useState, useEffect, Component } from "react";
import { useHistory, withRouter } from "react-router-dom";
import Select from "react-select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

/*
    Function:
        - Main function for the search bar that is implemented in the landing page.

    (written by Toby Dixon)
*/

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      query: null,
    };

    console.log(this.props);
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
        console.log(tempArray);
        this.setState({ categories: tempArray });
      })
      .then(() => {
        console.log(this.state);
      });
  }

  handleChange = (e) => {
    this.setState({ query: e });
  };

  callSearch = () => {
    console.log(typeof this.props.search);
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
        {/* {this.state.query != null ? this.state.query[0].value : 'null'} */}
      </div>
    );
  }
}

const style = {};

export default withRouter(SearchBar);
