import logo from "./logo.svg";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import React, { Component } from "react";
import LandingPage from "./LandingPage";
import axios from "axios";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";
import DatasetsList from "./components/DatasetsList";
import AddDataset from "./components/AddDataset";
import ClimateData from "./components/ClimateData";
import NewsPage from "./components/NewsPage";
import RankingUsersList from "./components/RankingUsersList";

// Main app component of the website
// Contains functions for getting data from the api and routing pages to different urls

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file_name: null,
      title: null,
      category: null,
      title_website: "ClimateXtractor.com",
      accessToken: null,
    };
  }

  handleRegisterFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  handleLoginFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then((res) => {
        this.setState({ accessToken: res.data.access_token });
        window.localStorage.setItem("refreshToken", res.data.refresh_token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  isAuthenticated = () => {
    if (this.state.accessToken || this.validRefresh()) {
      return true;
    }
    return false;
  };

  validRefresh = () => {
    const token = window.localStorage.getItem("refreshToken");
    if (token) {
      const options = {
        url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/refresh`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "post",
      };
      axios(options)
        .then((res) => {
          this.setState({ accessToken: res.data.access_token });
          return true;
        })
        .catch((err) => {
          return false;
        });
    }
    return false;
  };

  logoutUser = () => {
    window.localStorage.removeItem("refreshToken");
    this.setState({ accessToken: null });
  };

  onChangeHandler = (event) => {
    if (event.target.files) {
      this.setState({ [event.target.name]: event.target.files[0] });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  onClickDownloadFile = (event) => {
    const file_name = event.target.name;
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/download`.concat(
        "/",
        file_name
      ),
      method: "get",
      responseType: "blob",
    };
    axios(options)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="App">
        <NavBar
          className="navbar"
          title={this.state.title_website}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />
        <header className="App-header">
          <div className="container">
            <br />
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <LandingPage climate_data={this.state.climate_data} />
                )}
              />
              <Route exact path="/data" render={() => <ClimateData />} />
              <Route exact path="/news" render={() => <NewsPage />} />
              <Route
                exact
                path="/rankings"
                render={() => <RankingUsersList />}
              />
              <Route
                exact
                path="/login"
                render={() => (
                  <LoginForm
                    // eslint-disable-next-line react/jsx-handler-names
                    handleLoginFormSubmit={this.handleLoginFormSubmit}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/register"
                render={() => (
                  <RegisterForm
                    // eslint-disable-next-line react/jsx-handler-names
                    handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/status"
                render={() => (
                  <UserStatus
                    accessToken={this.state.accessToken}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/datasets"
                render={() => (
                  <DatasetsList
                    datasets={this.state.datasets}
                    handleClick={this.onClickDownloadFile}
                    isAuthenticated={this.isAuthenticated}
                    accessToken={this.state.accessToken}
                  />
                )}
              />
              <Route
                exact
                path="/datasets/upload"
                render={() => (
                  <AddDataset
                    // handleChange={this.onChangeHandler}
                    // handleClick={this.uploadFile}
                    accessToken={this.state.accessToken}
                    isAuthenticated={this.isAuthenticated}
                    // handleSelectChange={this.uploadCategoryHandler}
                  />
                )}
              />
              <Redirect from="*" to path="/" />
            </Switch>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
