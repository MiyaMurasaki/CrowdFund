import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom"
import './index.css';
import App from './App';
import LoginPage from './components/LoginPage/LoginPage'
import SignUpPage from './components/SignUpPage/SignUpPage'
import StartProjectPage from './components/StartProjectPage/StartProjectPage'
import DisplayProjectDetailsPage from './components/DisplayProjectDetailsPage/DisplayProjectDetailsPage'
import EditProjectDetailsPage from './components/EditProjectDetailsPage/EditProjectDetailsPage'
import FundProjectPage from './components/FundProjectPage/FundProjectPage'
import UserProfilePage from './components/UserProfilePage/UserProfilePage'
import ExploreProjectsPage from './components/ExploreProjectsPage/ExploreProjectsPage'
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

const routing = (
    <Router>
      <div>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/login" component={LoginPage} />
            <Route path="/signup" component={SignUpPage} />
            <Route path="/start" component={StartProjectPage} />
            <Route path="/editproject/:username/:orgname/:teamname/:projname" component={EditProjectDetailsPage} />
            <Route path="/projects/:username/:orgName/:teamName/:projName" component={DisplayProjectDetailsPage} />
            <Route path="/explore" component={ExploreProjectsPage} />
            <Route path="/fund/:username/:orgName/:teamName/:projName" component={FundProjectPage} />
            <Route path="/profile/:username" component={UserProfilePage} />
        </Switch>
      </div>
    </Router>
  )


const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(routing, rootElement);
} else {
  ReactDOM.render(routing, rootElement);
}
// ReactDOM.render(
//     routing
//     , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
