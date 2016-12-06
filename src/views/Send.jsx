import React, {PropTypes, Component} from "react";
import {send} from "../actions";
import {List} from "immutable";

export default class Send extends Component {

    constructor() {
        super();
        this.state = {
            showDropdownCurrency: false,
            recipientInputError:'',
            amountInputError:'',
            amount:'0',
            amountAlias:'0',
            currency:'',
            currencyAlias:'ALS'
        };
        this.recipientHandler = this.recipientHandler.bind(this);
        this.amountHandler = this.amountHandler.bind(this);
        this.send = this.send.bind(this);
        this.revertShowCurrency = this.revertShowCurrency.bind(this);
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
        this.pickCurrency = this.pickCurrency.bind(this);
    }

    componentWillMount(){
        this.pickCurrency(this.props.balances.get(0).get('symbol'), this.props.balances);
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
        let integer = parseFloat(text, 10);
        let balance = this.props.balances ?
            this.props.balances.find(balance => balance.get('symbol') === this.state.currency)
                .get('balance')
            : null;

        if (text !== '' && isNaN(text)) {
            this.setState({amount: text, amountInputError: 'Not a number.'});
        } else if (this.props.balances && integer > balance) {
            this.setState({amount: text, amountInputError: 'Not enough tokens on your balance.'});
        } else if (!/^\d*[\.]?\d{0,8}$/.test(text)) {
            this.setState({
                amount: text,
                amountInputError: 'You can\'t send amount having more than 8 decimal places'
            });
        } else if (text.startsWith("-")) {
            this.setState({amount: text, amountInputError: 'Has to be positive number.'});
        } else {
            this.setState({
                amount: text,
                amountAlias: integer * 13,
                amountInputError: '',
                fee: integer * 0.1,
                feeAlias: integer * 1.3
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
        this.setState({recipient: '', amount: ''});
    }

    showDropdownCurrency() {
        return (
            <div className="currency-dropdown">
                {this.state.currencies.map(currency =>
                    <p onClick={() => this.pickCurrency(currency, this.props.balances)}
                       className="currency-dropdown-entry">{currency}</p>)}
            </div>
        );
    }

    pickCurrency(currency, balances) {
        if (balances) {
            let currencies = [];
            balances.forEach((balance) => {
                if (balance.get('symbol') === currency) {
                    return;
                }
                currencies.push(balance.get('symbol'));
            });
            this.setState({
                currency: currency,
                currencies: currencies,
                showDropdownCurrency: false,
            });
        }
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
                                        onClick={() => this.revertShowCurrency()}>
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
                        ≈ {this.state.amountAlias} {this.state.currencyAlias}</p>
                </div>

                <div className="row">
                            <span>
                                <p className="send-fee-label">Fee:</p>
                                <p className="send-fee-amount">{this.state.fee}</p>
                                <p className="send-fee-text">{this.state.currency}&nbsp;
                                    ≈ {this.state.feeAlias} {this.state.currencyAlias}</p>
                            </span>
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
