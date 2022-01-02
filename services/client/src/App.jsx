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
import DatasetsList from "./components/DatasetsList";
import AddDataset from "./components/AddDataset";

/*
    Function:
        - The main app function which defines routes all the different pages within the web page.

    (written by Toby Dixon)
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      categories: [],
      datasets: [],
      file_name: null,
      title: null,
      category: null,
      title_website: "ClimateXtractor.com",
      accessToken: null,
    };
  }

  componentDidMount() {
    this.getUsers();
    this.getCategories();
    this.getDatasetList();
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

  getDatasetList() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/datasets`)
      .then((res) => {
        this.setState({ datasets: res.data });
      })
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
    return !!(this.state.accessToken || this.validRefresh());
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

  onChangeHandler = (event) => {
    if (event.target.files) {
      console.log(event.target.files[0]);
      this.setState({ [event.target.name]: event.target.files[0] });
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }
  };

  uploadFile = (event) => {
    event.preventDefault();
    let formData = new FormData();
    console.log(this.state.file_name);
    console.log(this.state.title);
    console.log(this.state.category);

    formData.append("file", this.state.file_name);
    formData.append("title", this.state.title);
    formData.append("category", this.state.category);

    console.log(formData.get("file"));
    console.log(formData.get("title"));
    console.log(formData.get("category"));

    axios
      .post(
        `${process.env.REACT_APP_USERS_SERVICE_URL}/datasets/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.state.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.getDatasetList();
      })
      .catch((err) => console.log(err));
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
            className='navbar'
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
                  <LandingPage />
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
                path="/categories"
                render={() => (
                  <CategoryList categories={this.state.categories} />
                )}
              />
              <Route
                exact
                path="/datasets"
                render={() => (
                  <DatasetsList
                    datasets={this.state.datasets}
                    handleClick={this.onClickDownloadFile}
                    accessToken={this.state.accessToken}
                    isAuthenticated={this.isAuthenticated}
                  />
                )}
              />
              <Route
                exact
                path="/datasets/upload"
                render={() => (
                  <AddDataset
                    handleChange={this.onChangeHandler}
                    handleClick={this.uploadFile}
                  />
                )}
              />
            </Switch>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
