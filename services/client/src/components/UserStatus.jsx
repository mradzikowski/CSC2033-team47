import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      date_created: "",
    };
  }
  componentDidMount() {
    this.getUserStatus();
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    };
    return axios(options)
      .then((res) => {
        this.setState({
          username: res.data.username,
          email: res.data.email,
          date_created: res.data.date_created,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <ul>
          <li>
            <strong>Email:</strong>&nbsp;
            <span data-testid="user-email">{this.state.email}</span>
          </li>
          <li>
            <strong>Username:</strong>&nbsp;
            <span data-testid="user-username">{this.state.username}</span>
          </li>
          <li>
            <strong>Date created</strong>&nbsp;
            <span data-testid="user-date-created">
              {this.state.date_created}
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

UserStatus.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
};

export default UserStatus;
