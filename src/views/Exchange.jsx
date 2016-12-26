import React from "react";
import {getExchangeRates} from "../actions";


export default class Exchange extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            showDropdownInputCurrency: false,
            showDropdownOutputCurrency: false,
            amount: '', //Variable for input
        };
        this.generateRates = this.generateRates.bind(this);
        this.dontShowCurrency = this.dontShowCurrency.bind(this);
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
    }

    dontShowCurrency(string) {
        if (string === 'input') {
            let revert = this.state.showDropdownInputCurrency;
            this.setState({showDropdownInputCurrency: !revert})
        } else {
            let revert = this.state.showDropdownOutputCurrency;
            this.setState({showDropdownOutputCurrency: !revert})
        }
    }

    showDropdownCurrency(currencies, string) {
        return (
            <div className="currency-dropdown">
                {currencies.map(currency =>
                    <p onClick={() => {
                        this.props.pickCurrency(currency);
                        this.dontShowCurrency(string)
                    }}
                       className="currency-dropdown-entry">{currency}</p>)}
            </div>
        );
    }

    generateRates() {
        return (
            <div>
                {
                    this.props.exchangeRates.map((rate, index) => {
                        return (<div className=" col-md-12 exchange-rates-container">
                            <div className="row">
                                <p className="exchange-rates-currency">{rate.get('symbol')}</p>
                            </div>
                            <div className="row">
                                <p className="exchange-rates-text">
                                    Sell for&nbsp;
                                </p>
                                <p className="exchange-rates-amount">
                                    {rate.get('sellPrice')}
                                </p>
                                <p className="exchange-rates-text">
                                    &nbsp;ETH
                                </p>
                            </div>
                            <div className="row">
                                <p className="exchange-rates-text">
                                    Buy for&nbsp;
                                </p>
                                <p className="exchange-rates-amount">
                                    {rate.get('buyPrice')}
                                </p>
                                <p className="exchange-rates-text">
                                    &nbsp;ETH
                                </p>
                                <div className="exchange-rates-separator-horizontal"/>
                            </div>
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
                        <div className="col-md-6">
                            <h2>Exchange</h2>
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
                                        onClick={this.props.changeOperation}
                                >
                                    <p className="exchange-sell-buy-button-text">
                                        {this.props.operation}
                                    </p>
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-random" aria-hidden="true"/>
                                    </div>
                                </button>
                                <input className="exchange-amount-input"
                                       value={this.props.amount}
                                       type="text"
                                       placeholder="0.0"
                                       onChange={input => this.props.amountHandler(input.target.value)}
                                />
                                <span style={{"position": "relative"}}>
                                    <p className="send-input-currency-label"
                                       onClick={() => this.dontShowCurrency('input')}
                                    >
                                        {this.props.inputCurrency}
                                    </p>
                                    {this.props.inputCurrencies.length !== 0 ?
                                        <button className="dropdown-button"
                                                onClick={() => this.dontShowCurrency('input')}
                                        >
                                            <div className="dropdown-symbol">
                                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                                            </div>
                                        </button>
                                        : null
                                    }
                                    {this.props.inputCurrencies.length !== 0 && this.state.showDropdownInputCurrency ?
                                        this.showDropdownCurrency(this.props.inputCurrencies, 'input')
                                        : null
                                    }
                                </span>
                            </div>

                            <div className="row exchange-left-alias-margin">
                                <h3>for</h3>
                                <p className="exchange-amount-getting"
                                   onClick={() => this.dontShowCurrency('output')}
                                >
                                    {this.props.result}
                                </p>
                                <span style={{"position": "relative"}}>
                                    <p className="send-input-currency-label">
                                        {this.props.outputCurrency}
                                    </p>
                                    {this.props.outputCurrencies.length !== 0 ?
                                        <button className="dropdown-button"
                                                onClick={() => this.dontShowCurrency('output')}
                                        >
                                            <div className="dropdown-symbol">
                                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                                            </div>
                                        </button>
                                        : null
                                    }
                                    {this.props.outputCurrencies.length !== 0 && this.state.showDropdownOutputCurrency ?
                                        this.showDropdownCurrency(this.props.outputCurrencies, 'output')
                                        : null
                                    }
                                </span>
                            </div>

                            <div className="row">
                                <button className="send-button" onClick={this.props.send}>{this.props.operation}</button>
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