import React from "react";
import {connect} from "react-redux";
import {configure, getAccounts, getBalances, setCurrentAccount, send} from "../actions";
import store from "../store";


@connect((store) => {
    return {
        balances: store.get('balances'),
        txHashes: store.get('txHashes'),
        accounts: store.get('accounts'),
        currentAccount: store.get('currentAccount')
    };
})
export default class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            recipient: '',
            recipientInputError: '',
            balances: [],
            currency: '',
            currencies: [],
            currencyAlias: 'ALS',
            amount: '',
            amountAlias: 0,
            fee: 0,
            feeAlias: 0,
            amountInputError: '',
            status: '',
            intervalID: '',
            showDropdownCurrency: false,
            showDropdownAddress: false
        };
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
        this.showDropdownAddress = this.showDropdownAddress.bind(this);
        this.revertShowCurrency = this.revertShowCurrency.bind(this);
        this.revertShowAddress = this.revertShowAddress.bind(this);
        this.pickCurrency = this.pickCurrency.bind(this);
        this.pickAddress = this.pickAddress.bind(this);
        this.generateHashes = this.generateHashes.bind(this);
        this.setBalanceUpdater = this.setBalanceUpdater.bind(this);
        this.showBalances = this.showBalances.bind(this);
        this.recipientHandler = this.recipientHandler.bind(this);
        this.amountHandler = this.amountHandler.bind(this);
        this.send = this.send.bind(this);
    }

    componentWillMount() {
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('accounts')) {
                        this.setBalanceUpdater();
                    }
                    let balances = store.getState().get('balances');
                    if (balances) {
                        this.pickCurrency(balances.get(0).get('symbol'), balances);
                        unsubscribe();
                    }
                }
            );
            getAccounts();

        }
    }

    setBalanceUpdater() {
        this.setState({intervalID: setInterval(() => getBalances(), 15000)});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
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
                showDropdownCurrency: false
            });
        }
    }

    revertShowCurrency() {
        let revert = this.state.showDropdownCurrency;
        this.setState({showDropdownCurrency: !revert})
    }

    revertShowAddress() {
        let revert = this.state.showDropdownAddress;
        this.setState({showDropdownAddress: !revert})
    }

    pickAddress(address) {
        setCurrentAccount(address);
        this.setState({
            showDropdownAddress: false
        });

    }

    showDropdownAddress() {
        if (this.props.accounts) {
            return (
                <div className="address-dropdown">
                    {this.props.accounts.map(account => {
                        if (account === web3.eth.defaultAccount) {
                            return;
                        }
                        return ( <p onClick={() => this.pickAddress(account)}
                                    className="address-dropdown-entry">{account}</p>);
                    })}
                </div>
            );
        }
    }

    generateHashes() {
        if (this.props.txHashes) {
            let niceHashes = [];
            this.props.txHashes.forEach((hash, key) => niceHashes.push(
                <div>
                    <p className="hash">{hash}</p>
                    {(key + 1) === this.props.txHashes.size ? null :
                        <div className="hash-separator"/> }
                </div>
            ));
            return niceHashes;
        }
    }

    showBalances() {
        if (this.props.balances && this.props.balances.size > 0) {
            let balanceInfo = [];
            this.props.balances.toArray().forEach((entry, index) => {
                balanceInfo.push(
                    <div key={entry.get('symbol')}>
                        <p className="balance-value">{entry.get('balance')}&nbsp;</p>
                        {entry.get('pending') === 0 ? null :
                            <p className="balance-pending">{entry.get('pending')}&nbsp;</p>
                        }
                        <p className="balance-currency">{entry.get('symbol')}</p>
                        <div className="balance-vertical-separator"/>
                        <p className="balance-value">alias-balance&nbsp;</p>
                        <p className="balance-currency">alias-currency</p>
                        {(index + 1) === this.props.balances.size ? null :
                            <div className="balance-horizontal-separator"/> }
                    </div>
                )
            });
            return balanceInfo;
        }
    }

    render() {
        let hashes = this.generateHashes();
        let balances = this.showBalances();
        let currencyChoices = this.showDropdownCurrency();
        let accountChoices = this.showDropdownAddress();

        return (
            <div>
                <div className="col-md-6">
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


                    {this.props.txHashes ?
                        <div className="transparent-box">
                            <div className="row">
                                <h2>Transaction Hashes</h2>
                            </div>

                            <div className="row">
                                <div className="hash-container">
                                    {hashes}
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>


                <div className="col-md-6">
                    <div className="transparent-box">
                        <div className="row">
                            <h2>Balances</h2>
                        </div>
                        <div className="row">
                            <h3>for</h3>
                            <span style={{"position": "relative"}}>
                                <p className="dropdown-label">{this.props.currentAccount}</p>
                                <button className="dropdown-button"
                                        onClick={() => this.revertShowAddress()}>
                                    <div className="dropdown-symbol">
                                        <i class="fa fa-arrow-down" aria-hidden="true"/>
                                    </div>
                                </button>
                                {this.state.showDropdownAddress ? accountChoices : null}
                            </span>
                        </div>

                        <div className="row">
                            <div className="balance-container">
                                {balances}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}