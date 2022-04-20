import React from 'react';
import { Route } from 'react-router';

/**
 * Import all page components here
 */
import App from './App';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>
    <Route path="/login" component={LoginPage} />
  </Route>
);