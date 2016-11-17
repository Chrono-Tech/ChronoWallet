import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from 'react-router';

import store from "./store";
import Layout from "./views/Layout";

// Custom css
require('./css/style.css');

const app = document.getElementById('app');

ReactDOM.render(<Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" component={Layout}>
        </Route>
    </Router>
</Provider>, app);