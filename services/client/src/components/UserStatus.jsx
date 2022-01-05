import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import MailIcon from "@mui/icons-material/Mail";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      date_created: "",
      subscribe: "",
      button: "",
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
          subscribe: res.data.subscribed,
        });
        if (this.state.subscribe) {
          this.setState({
            button: (
              <Button onClick={this.handleSubscribeButton} variant="outlined">
                Unsubscribe <MailIcon />
              </Button>
            ),
          });
        } else {
          this.setState({
            button: (
              <Button onClick={this.handleSubscribeButton} variant="outlined">
                Subscribe <MailIcon />
              </Button>
            ),
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSubscribeButton = () => {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/users/subscription`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    };

    return axios(options)
      .then((res) => {
        this.getUserStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <Box>
        <Paper>
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
            <li>{this.state.button}</li>
          </ul>
        </Paper>
      </Box>
    );
  }
}

UserStatus.propTypes = {
  accessToken: PropTypes.string,
  isAuthenticated: PropTypes.func.isRequired,
};

export default UserStatus;
