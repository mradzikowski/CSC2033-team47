import logo from "./logo.svg";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import LandingPage from "./LandingPage";
import axios from "axios";
import UsersList from "./components/UsersList";
import CategoryList from "./components/CategoryList";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";

/*
    Function:
        - The main app function which defines routes all the different pages within the web page.

    (written by Toby Dixon)
*/

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      categories: [],
      title: "ClimateXtractor.com",
      accessToken: null,
    };
  }

  componentDidMount() {
    this.getUsers();
    this.getCategories();
  }

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then((res) => {
        this.setState({ users: res.data });
      }) // updated
      .catch((err) => {
        console.log(err);
      });
  }

  getCategories() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/category`)
      .then((res) => {
        this.setState({ categories: res.data });
      }) // updated
      .catch((err) => {
        console.log(err);
      });
  }

  handleRegisterFormSubmit = (data) => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
      })
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
        this.getUsers();
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
    const token = window.localStorage.getItem("refresh_token");
    if (token) {
      axios
        .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/auth/refresh`, {
          refresh_token: token,
        })
        .then((res) => {
          this.setState({ access_token: res.data.access_token });
          this.getUsers();
          window.localStorage.setItem("refresh_token", res.data.refresh_token);
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar
            title={this.state.title}
            logoutUser={this.logoutUser}
            isAuthenticated={this.isAuthenticated}
          />
          <section className="section">
            <div className="container">
              <div className="columns">
                <div className="column is-half">
                  <br />
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={() => (
                        <div>
                          <div>
                            <LandingPage />
                          </div>
                        </div>
                      )}
                    />
                    <Route
                      exact
                      path="/categories"
                      render={() => (
                        <CategoryList categories={this.state.categories} />
                      )}
                    />
                    <Route
                      exact
                      path="/users"
                      render={() => <UsersList users={this.state.users} />}
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
                          handleRegisterFormSubmit={
                            this.handleRegisterFormSubmit
                          }
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
                      path="/categories"
                      render={() => (
                        <CategoryList categories={this.state.categories} />
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </section>
        </header>
      </div>
    );
  }
}

export default App;
