import logo from "./logo.svg";
import "./App.css";
import { Route, BrowserRouter as Router} from "react-router-dom";
import {state, useEffect, useState} from 'react';
import LandingPage from './LandingPage'

function App() {

  return (
    <div className="App" >
      <header className="App-header">
        <Router>
          <Route exact path='/' component={LandingPage}></Route>
        </Router>
      </header>
    </div>
  );
}

export default App;
