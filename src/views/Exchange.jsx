import React from "react";
import {getExchangeRates, approve, sell, buy} from "../actions";
import BigNumber from "bignumber.js";


export default class Exchange extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            showDropdownInputCurrency: false,
            showDropdownOutputCurrency: false,
        };
        this.generateRates = this.generateRates.bind(this);
        this.showCurrencySwitcher = this.showCurrencySwitcher.bind(this);
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
    }

    showCurrencySwitcher(string) {
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
                        string === 'input' ?
                            this.props.pickInputCurrency(currency) :
                            this.props.pickOutputCurrency(currency);
                        this.showCurrencySwitcher(string);
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
                            <div className="row flex-one-line">
                                <p className="exchange-rates-currency">{rate.get('symbol')}</p>
                                {this.props.balances.get(index).get('allowance') === '0' ?
                                    <span className="exchange-currency-header-container">
                                        <div className="exchange-cross">
                                            <i class="fa fa-times" aria-hidden="true"/>
                                        </div>
                                        <button className="exchange-allow"
                                                onClick={() => approve(this.props.balances.get(index).get('symbol'), true)}
                                        >
                                            Allow
                                        </button>
                                    </span>
                                    :
                                    <div className="exchange-currency-header-container">
                                        <div className="exchange-tick">
                                            <i class="fa fa-check" aria-hidden="true"/>
                                        </div>
                                        <button className="exchange-disallow"
                                                onClick={() => approve(this.props.balances.get(index).get('symbol'), false)}
                                        >
                                            Disallow
                                        </button>
                                    </div>
                                }

                            </div>
                            <div className="row">
                                <p className="exchange-rates-text">
                                    Buy for&nbsp;
                                </p>
                                <p className="exchange-rates-amount">
                                    {rate.get('sellPrice').toFixed(18).replace(/\.?0+$/, "")}
                                </p>
                                <p className="exchange-rates-text">
                                    &nbsp;ETH
                                </p>
                            </div>
                            <div className="row">
                                <p className="exchange-rates-text">
                                    Sell for&nbsp;
                                </p>
                                <p className="exchange-rates-amount">
                                    {rate.get('buyPrice').toFixed(18).replace(/\.?0+$/, "")}
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
                                <p className="send-label">
                                    Exchange
                                </p>
                                <input className="exchange-amount-input"
                                       value={this.props.amount}
                                       type="text"
                                       placeholder="0.0"
                                       onChange={input => this.props.amountHandler(input.target.value)}
                                />
                                <span style={{"position": "relative"}}>
                                    <p className="send-input-currency-label"
                                       onClick={() => this.showCurrencySwitcher('input')}
                                    >
                                        {this.props.inputCurrency}
                                    </p>
                                    {this.props.inputCurrencies.length !== 0 ?
                                        <button className="dropdown-button"
                                                onClick={() => this.showCurrencySwitcher('input')}
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
                                    {this.props.amountInputError.length === 0 ? null :
                                        <span className="send-input-error-sign">
                                            <i class="fa fa-hand-o-left" aria-hidden="true"/>
                                        </span>
                                    }
                                </span>
                                <p className="send-input-error"> {this.props.amountInputError}</p>
                            </div>

                            <div className="row exchange-left-alias-margin">
                                <h3>for</h3>
                                <p className="exchange-amount-getting"
                                   onClick={() => this.showCurrencySwitcher('output')}
                                >
                                    {this.props.result}
                                </p>
                                <span style={{"position": "relative"}}>
                                    <p className="send-input-currency-label">
                                        {this.props.outputCurrency}
                                    </p>
                                    {this.props.outputCurrencies.length !== 0 ?
                                        <button className="dropdown-button"
                                                onClick={() => this.showCurrencySwitcher('output')}
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
                                <button className="send-button"
                                        onClick={() => this.props.exchange()}>
                                    Exchange
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="row">
                                <p className="exchange-label">Current Rates</p>
                                <button className="exchange-recheck-button"
                                        onClick={() => this.props.setLoadingRates()}
                                >
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-retweet" aria-hidden="true"/>
                                    </div>
                                </button>
                                {this.props.loadingRates ?
                                    <p className="exchange-loader">Loading...</p>
                                    : null
                                }
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