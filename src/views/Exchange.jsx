import React from "react";
import {getExchangeRates} from "../actions";


export default class Exchange extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            operation: 'Sell',
            amount: '', //Variable for input
        };
        this.amountHandler = this.amountHandler.bind(this);
        this.changeOperation = this.changeOperation.bind(this);
        this.generateRates = this.generateRates.bind(this);
    }

    amountHandler(text) {
        return;
    }

    changeOperation() {
        if (this.state.operation === 'Sell') {
            this.setState({operation: 'Buy'})
        } else {
            this.setState({operation: 'Sell'})
        }
    }

    generateRates() {
        return (
            <div className="col-md-12">
                {
                    this.props.exchangeRates.map((rate, index) => {
                        return (<div className="row vertical-center">
                            <div className="col-md-3">
                                <p className="exchange-rates-currency">{rate.get('symbol')}</p>
                                <div className="exchange-rates-separator-vertical"/>
                            </div>
                            <div className="col-md-9">
                                <div className="row">
                                    <p className="exchange-rates-amount">Sell: {rate.get('sellPrice')}</p>
                                </div>
                                <div className="row">
                                    <p className="exchange-rates-amount">Buy: {rate.get('buyPrice')}</p>
                                </div>
                            </div>
                            <div className="exchange-rates-separator-horizontal"/>
                        </div>);
                    })
                }
            </div>
        );
    }

    render() {
        let rates = this.generateRates();
        return (
            <div className="col-md-12">
                <div className="transparent-box">
                    <div className="row">
                        <h2>Exchange</h2>
                        <div className="col-md-6">
                            <div className="row">
                                <h3>from</h3>
                                <span style={{"position": "relative"}}>
                                    <p className="dropdown-label">{this.props.currentAccount}</p>
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-arrow-down" aria-hidden="true"/>
                                    </div>
                                 </span>
                            </div>

                            <div className="row">
                                <button className="exchange-sell-buy-button"
                                        onClick={this.changeOperation}
                                >
                                    <p className="exchange-sell-buy-button-text">
                                        {this.state.operation}
                                    </p>
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-random" aria-hidden="true"/>
                                    </div>
                                </button>
                                <input className="exchange-amount-input"
                                       value={this.props.amount}
                                       type="text"
                                       placeholder="0.0"
                                       onChange={input => this.amountHandler(input.target.value)}
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
                            </div>

                            <div className="row exchange-left-alias-margin">
                                <h3>for</h3>
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

                        <div className="col-md-6">
                            <div className="row">
                                <p className="exchange-label">Current Rates</p>
                                <button className="exchange-recheck-button"
                                        onClick={() => getExchangeRates()}
                                >
                                    <p className="exchange-recheck-button-text">
                                        Recheck rates
                                    </p>
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-retweet" aria-hidden="true"/>
                                    </div>
                                </button>
                            </div>

                            <div className="row">
                                {rates}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}