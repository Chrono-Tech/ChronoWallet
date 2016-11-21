import React from "react";
import {connect} from "react-redux";
import {configure, getAccounts, getBalance, send} from "../actions";
import store from "../store";
import NavBar from "../components/NavBar";


@connect((store) => {
    return {
        balance: store.get('balance'),
        txHashes: store.get('txHashes'),
        contract: store.get('contract'),
        accounts: store.get('accounts'),
        currentAccount: store.get('currentAccount')
    };
})
export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            recipient: '',
            recipientInputError: '',
            currency: 'LHAU',
            currencyAlias: 'AUD',
            amount: '',
            amountAlias: 0,
            fee: 0,
            feeAlias: 0,
            amountInputError: '',
            status: '',
            intervalID: '',
        };
        this.showDropdown = this.showDropdown.bind(this);
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
                        getBalance();
                        this.setBalanceUpdater();
                        unsubscribe();
                    }
                }
            );
            getAccounts();

        }
    }

    setBalanceUpdater() {
        this.setState({intervalID: setInterval(() => getBalance(), 15000)});
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
        let integer = parseInt(text, 10);
        if (text !== '' && isNaN(text)) {
            this.setState({amount: text, amountInputError: 'Not a number.'});
        } else if (this.props.balance && integer > parseInt(this.props.balance.get('LHAU'), 10)) {
            this.setState({amount: text, amountInputError: 'Not enough tokens on your balance.'});
        } else if (text.startsWith("-")) {
            this.setState({amount: text, amountInputError: 'Has to be positive number.'});
        } else {
            this.setState({amount: text, amountAlias: integer * 13.17 , amountInputError: '', fee:integer * 0.01, feeAlias:integer * 1.317});
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

        send(this.state.recipient, this.state.amount);
        this.setState({recipient: '', amount: ''});
    }

    showDropdown() {
        if (this.props.balances && this.props.balances.size > 0) {
            let balanceInfo = [];
            this.props.balances.forEach(entry => {
                balanceInfo.push(
                    <div key={entry.get('account')} className="row">
                        <p className="balance-label">{entry.get('account')}</p>
                        <div className="balance-container">
                            <p className="balance-value">{entry.get('balances').get('LHAU')}&nbsp;</p>
                            {entry.get('balances').get('LHAUpending') !== '0' ?
                                <p className="balance-pending">{entry.get('balances').get('LHAUpending')}&nbsp;</p>
                                :
                                null
                            }
                            <p className="balance-currency">LHAU</p>
                        </div>
                    </div>
                )
            });
            return balanceInfo;
        } else {
            return <h6>There is no address connected.</h6>
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
        if (this.props.balance) {
            let pendingBalance = this.props.balance.get('LHAUpending');
            return (<div className="balance-container">

                <p className="balance-value">{this.props.balance.get('LHAU')}&nbsp;</p>
                {pendingBalance === '0' ? null :
                    <p className="balance-pending">{pendingBalance}&nbsp;</p>
                }
                <p className="balance-currency">LHAU</p>
                <div className="balance-vertical-separator"/>
                <p className="balance-value">{77.33}&nbsp;</p>
                <p className="balance-currency">AUD</p>

                <div className="balance-horizontal-separator"/>

                <p className="balance-value">{this.props.balance.get('LHAU')}&nbsp;</p>
                {pendingBalance === '0' ? null :
                    <p className="balance-pending">{pendingBalance}&nbsp;</p>
                }
                <p className="balance-currency">LHUS</p>
                <div className="balance-vertical-separator"/>
                <p className="balance-value">{20.16}&nbsp;</p>
                <p className="balance-currency">USD</p>

                <div className="balance-horizontal-separator"/>

                <p className="balance-value">{123.321}&nbsp;</p>
                <p className="balance-pending">{'+1'}&nbsp;</p>
                <p className="balance-currency">LHGB</p>
                <div className="balance-vertical-separator"/>
                <p className="balance-value">{10.17}&nbsp;</p>
                <p className="balance-currency">GBP</p>

                <div className="balance-horizontal-separator"/>


                <p className="balance-value">{1234564444478.87654321}&nbsp;</p>
                <p className="balance-pending">{'+1.56666678'}&nbsp;</p>
                <p className="balance-currency">LHEU</p>
                <div className="balance-vertical-separator"/>
                <p className="balance-value">{300.22}&nbsp;</p>
                <p className="balance-currency">EU</p>
            </div>);
        }
    }

    render() {
        console.log("Balance", this.props.balance);
        let hashes = this.generateHashes();
        let balances = this.showBalances();

        if (typeof web3 == 'undefined') {
            return (<div className="container transparent-box text-center vertical-align">
                <p className="blue-big">Chrono</p>
                <p className="yellow-big">Wallet</p>
                <h1>This browser doesn't support Web3. Use browser like Mist or install
                    Metamask.</h1>
            </div>);
        } else {
            return (<div className="container">
                <NavBar/>

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
                            <p className="send-input-currency-label">{this.state.currency}</p>
                            <div className="dropdown-button">
                                <div className="dropdown-symbol">
                                    <i class="fa fa-arrow-down" aria-hidden="true"/>
                                </div>
                            </div>
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
                            <p className="send-amount-label-alias">is equal to</p>
                            <p className="send-amount-alias">{this.state.amountAlias} {this.state.currencyAlias}</p>
                        </div>

                        <div className="row">
                            <span>
                                <p className="send-fee-label">Fee:</p>
                                <p className="send-fee-amount">{this.state.fee}</p>
                                <p className="send-fee-text">{this.state.currency} ({this.state.feeAlias} {this.state.currencyAlias})</p>
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
                    <div className=" transparent-box">
                        <div className="row">
                            <h2>Balances</h2>
                        </div>
                        <div className="row">
                            <h3>for</h3>
                            <p className="dropdown-label">{this.props.currentAccount}</p>
                            <div className="dropdown-button">
                                <div className="dropdown-symbol">
                                    <i class="fa fa-arrow-down" aria-hidden="true"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            {balances}
                        </div>
                    </div>
                </div>
            </div>);
        }
    }
}