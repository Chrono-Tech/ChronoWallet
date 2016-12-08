import React, {PropTypes, Component} from "react";
import {send} from "../actions";
import {List} from "immutable";
import BigNumber from "bignumber.js";

export default class Send extends Component {

    constructor() {
        super();
        this.state = {
            showDropdownCurrency: false,
            recipientInputError: '',
            amountInputError: '',
            amount: '',
            amountFiat: '0',
            currency: '',
            currencies: '',
            currencyAlias: '',
            currenciesAlias: '',
            fee: 0,
            feeRate: 0, //is a BigNumber
            feeAlias: 0,
            aliasRate: 0, //is a BigNumber
            total: 0,
            totalAlias: 0,
            switched: false
        };
        this.recipientHandler = this.recipientHandler.bind(this);
        this.amountHandler = this.amountHandler.bind(this);
        this.send = this.send.bind(this);
        this.switchAlias = this.switchAlias.bind(this);
        this.revertShowCurrency = this.revertShowCurrency.bind(this);
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
        this.pickCurrency = this.pickCurrency.bind(this);
    }

    componentWillMount() {
        this.pickCurrency(this.props.balances.get(0).get('symbol'));
    }

    revertShowCurrency() {
        let revert = this.state.showDropdownCurrency;
        this.setState({showDropdownCurrency: !revert})
    }


    recipientHandler(text) {
        if (text.length <= 42) {
            this.setState({recipient: text, recipientInputError: ''});
        } else {
            this.setState({
                recipient: text,
                recipientInputError: 'Address has to be 42 symbols long.'
            });
        }
    }

    amountHandler(text) {
        let balance = this.state.switched ?
            this.props.balances.find(balance => balance.get('fiatSymbol') === this.state.currency)
                .get('balance')
            : this.props.balances.find(balance => balance.get('symbol') === this.state.currency)
            .get('balance');
        if (text !== '' && isNaN(text)) {
            this.setState({amount: text, amountInputError: 'Not a number.'});
        } else if (this.props.switched && new BigNumber(text).dividedBy(this.state.aliasRate).toNumber() > balance) {
            this.setState({amount: text, amountInputError: 'Not enough tokens on your balance.'});
        } else if (parseFloat(text) > balance) {
            this.setState({amount: text, amountInputError: 'Not enough tokens on your balance.'});
        } else if (this.props.switched && !/^\d*[\.]?\d{0,2}$/.test(text.replace(/\.?0+$/, ""))) {
            this.setState({
                amount: text,
                amountInputError: 'You can\'t send amount having more than 2 decimal places'
            });
        } else if (!/^\d*[\.]?\d{0,8}$/.test(text.replace(/\.?0+$/, ""))) {
            this.setState({
                amount: text,
                amountInputError: 'You can\'t send amount having more than 8 decimal places'
            });
        } else if (text.startsWith('-')) {
            this.setState({amount: text, amountInputError: 'Has to be positive number.'});
        } else if (text === '') {
            this.setState({
                amount: text,
                amountInputError: '',
                amountFiat: 0,
                fee: 0,
                feeAlias: 0,
                total: 0,
                totalAlias: 0
            });
        } else {
            let integer = new BigNumber(text);
            let aliasRate = this.state.aliasRate;
            let amountAlias = integer.times(aliasRate).round(2);
            let fee = integer.times(this.state.feeRate).round(8);
            if (integer.lessThan('0.000004')) {
                //Sets fee for extra-small numbers
                fee = new BigNumber('0.00000001');
            }
            let feeAlias = fee.times(aliasRate).round(2);
            let total = integer.plus(fee).round(8);
            let totalAlias = total.times(aliasRate).round(2);
            this.setState({
                amountInputError: '',
                amount: text,
                amountFiat: amountAlias.toString(),
                fee: fee.toFixed(8).replace(/\.?0+$/, ""),
                feeAlias: feeAlias.toFixed(2).replace(/\.?0+$/, ""),
                total: total.toFixed(8).replace(/\.?0+$/, ""),
                totalAlias: totalAlias.toFixed(2).replace(/\.?0+$/, "")
            });
        }
    }

    send() {
        if (this.state.recipient.length === 0) {
            this.setState({recipientInputError: 'This field is required to make send.'});
            return;
        } else if (this.state.amount.length === 0) {
            this.setState({amountInputError: 'This field is required to make send.'});
            return;
        }

        if (this.state.recipient.length !== 40 && this.state.recipient.length !== 42) {
            this.setState({recipientInputError: 'Address has to be 40 symbols long not including \'0x\' or 42 including \'0x\'.'});
            return;
        } else if (!web3.isAddress(this.state.recipient)) {
            this.setState({recipientInputError: 'Address has to be hexadecimal string. Check it has no special symbols and correct encoding.'});
            return;
        } else if (this.state.amountInputError.length > 0) {
            return;
        }

        send(this.state.recipient, this.state.amount, this.state.currency);
        this.setState({recipient: '', amount: '', amountFiat:0});
    }

    showDropdownCurrency() {
        return (
            <div className="currency-dropdown">
                {this.state.currencies.map(currency =>
                    <p onClick={() => this.pickCurrency(currency)}
                       className="currency-dropdown-entry">{currency}</p>)}
            </div>
        );
    }

    switchAlias() {
        let currency = this.state.currency;
        let currencies = this.state.currencies;
        let currencyAlias = this.state.currencyAlias;
        let currenciesAlias = this.state.currenciesAlias;
        let switched = this.state.switched;
        this.setState({
            currency: currencyAlias,
            currencies: currenciesAlias,
            currenciesAlias: currencies,
            currencyAlias: currency,
            switched: !switched
        });
    }

    pickCurrency(currency) {
        let currencies = [];
        let currencyAlias = '';
        let currenciesAlias = [];
        let aliasRate = 1;
        let fee = 0;
        if (this.state.switched) {
            this.props.balances.forEach((balance) => {
                if (balance.get('fiatSymbol') === currency) {
                    currencyAlias = balance.get('symbol');
                    aliasRate = new BigNumber(balance.get('fiatRate'));
                    fee = new BigNumber(balance.get('fee'));
                    return;
                }
                currencies.push(balance.get('fiatSymbol'));
                currenciesAlias.push(balance.get('symbol'));
            });
        } else {
            this.props.balances.forEach((balance) => {
                if (balance.get('symbol') === currency) {
                    currencyAlias = balance.get('fiatSymbol');
                    aliasRate = new BigNumber(balance.get('fiatRate'));
                    fee = new BigNumber(balance.get('fee'));
                    return;
                }
                currencies.push(balance.get('symbol'));
                currenciesAlias.push(balance.get('fiatSymbol'));
            });
        }
        this.setState({
            currency: currency,
            currencies: currencies,
            showDropdownCurrency: false,
            currenciesAlias: currenciesAlias,
            currencyAlias: currencyAlias,
            aliasRate: aliasRate,
            feeRate: fee
        });
    }

    render() {
        let currencyChoices = this.showDropdownCurrency();
        return (
            <div className="transparent-box">
                <div className="row">
                    <h2>Send</h2>
                </div>

                <div className="row">
                    <p className="send-label">Recipient</p>
                    <input className="send-recipient-input"
                           type="text" value={this.state.recipient}
                           placeholder="Recipient"
                           onChange={input => this.recipientHandler(input.target.value)}
                    />
                    {this.state.recipientInputError.length === 0 ? null :
                        <span className="send-input-error-sign">
                                    <i class="fa fa-hand-o-left" aria-hidden="true"/>
                                </span>
                    }
                </div>

                <div className="row">
                    <p className="send-input-error"> {this.state.recipientInputError}</p>
                </div>

                <div className="row">
                    <p className="send-label">Amount</p>
                    <input className="send-amount-input" type="text"
                           value={this.state.amount}
                           placeholder="0.0"
                           onChange={input => this.amountHandler(input.target.value)}
                    />
                    <span style={{"position": "relative"}}>
                        <p className="send-input-currency-label">{this.state.currency}</p>
                        <button className="dropdown-button"
                                onClick={() => this.revertShowCurrency()}
                        >
                            <div className="dropdown-symbol">
                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                            </div>
                        </button>
                        {this.state.showDropdownCurrency ? currencyChoices : null}
                    </span>
                    {this.state.amountInputError.length === 0 ? null :
                        <span className="send-input-error-sign">
                            <i class="fa fa-hand-o-left" aria-hidden="true"/>
                        </span>
                    }
                </div>

                <div className="row">
                    <p className="send-input-error"> {this.state.amountInputError}</p>
                </div>

                <div className="row">
                    <p className="send-amount-alias">
                        ≈ {this.state.amountFiat} {this.state.currencyAlias}</p>

                    <button className="sent-switch-button"
                            onClick={() => this.switchAlias()}
                    >
                        Switch
                    </button>
                </div>

                <div className="row">
                    <div>
                        <p className="send-fee-label">Fee:</p>
                        <p className="send-fee-amount">{this.state.fee}</p>
                        <p className="send-fee-text">{this.state.currency}&nbsp;
                            ≈ {this.state.feeAlias} {this.state.currencyAlias}</p>
                    </div>
                    <div>
                        <p className="send-fee-label">Total:</p>
                        <p className="send-fee-amount">{this.state.total}</p>
                        <p className="send-fee-text">{this.state.currency}&nbsp;
                            ≈ {this.state.totalAlias} {this.state.currencyAlias}</p>
                    </div>
                </div>

                <div className="row">
                    <button className="send-button" onClick={this.send}>Send</button>
                </div>
            </div>
        );
    }
}

Send.propTypes = {
    balances: PropTypes.instanceOf(List).isRequired,
};
