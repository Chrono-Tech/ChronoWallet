import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import store from "./store";
import Layout from "./views/Layout";
import Dashboard from "./views/Dashboard";
import Developing from "./views/Developing";

// Custom css
require('./css/style.css');

const app = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Dashboard}></IndexRoute>
                <Route path="developing" name="Developing" component={Developing}></Route>
            </Route>
        </Router>
    </Provider>, app);