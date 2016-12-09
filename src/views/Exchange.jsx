import React from "react";
import {connect} from "react-redux";
import {getAccounts, getBalances} from "../actions";
import store from "../store";


export default class Exchange extends React.Component {

    render() {
        return (
            <h1>Woohoo!</h1>
        );
    }

}