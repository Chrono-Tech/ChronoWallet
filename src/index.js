import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import store from "./store";
import Layout from "./views/Layout";
import Dashboard from "./views/Dashboard";
import Voting from "./views/Voting";
import Redemption from "./views/Redemption";
import Exchange from "./views/Exchange";

// Custom css
require('./css/style.css');

const app = document.getElementById('app');

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={Layout}>
                <IndexRoute component={Dashboard}></IndexRoute>
                <Route path="voting" name="Voting" component={Voting}></Route>
                <Route path="redemption" name="Redemption" component={Redemption}></Route>
                <Route path="exchange" name="Exchange" component={Exchange}></Route>
            </Route>
        </Router>
    </Provider>, app);