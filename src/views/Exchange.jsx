import React from "react";
import {connect} from "react-redux";
import {getAccounts, getBalances} from "../actions";
import store from "../store";


export default class Exchange extends React.Component {

    render() {
        return (
            <div className="col-md-10 col-md-offset-1">
                <div className="transparent-box">
                    <div className="row">
                        <h2>Exchange</h2>
                    </div>
                    <div className="row">
                        <h3>from</h3>
                        <span style={{"position": "relative"}}>
                            <p className="dropdown-label">0x8664780a208d57739274db68f62d0a3fb8c34b85</p>
                            <div className="dropdown-symbol">
                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                            </div>
                        </span>
                    </div>

                    <div className="row">
                        <p className="send-label">Sell</p>
                        <button className="dropdown-button">
                            <div className="dropdown-symbol">
                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                            </div>
                        </button>
                        <input className="exchange-amount-input" type="text"
                               placeholder="0.0"
                        />
                        <span style={{"position": "relative"}}>
                            <p className="send-input-currency-label">
                                ETH
                            </p>
                            <button className="dropdown-button">
                                <div className="dropdown-symbol">
                                    <i class="fa fa-arrow-down" aria-hidden="true"/>
                                </div>
                            </button>
                        </span>
                        <p className="exchange-label">for</p>
                        <p className="exchange-amount-getting">100</p>
                        <span style={{"position": "relative"}}>
                            <p className="send-input-currency-label">
                                LHAU
                            </p>
                            <button className="dropdown-button">
                                <div className="dropdown-symbol">
                                    <i class="fa fa-arrow-down" aria-hidden="true"/>
                                </div>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}