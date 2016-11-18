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
            amount: '',
            status: '',
            intervalID: '',
        };
        this.showDropdown = this.showDropdown.bind(this);
        this.generateHashes = this.generateHashes.bind(this);
        this.setBalanceUpdater = this.setBalanceUpdater.bind(this);
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
        // unsubscribe();
    }

    send() {
        this.setState({status: 'Clicked!'});
        send(this.state.recipient, this.state.amount);
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
                            {entry.get('balances').get('EZCpending') !== '0' ?
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
            this.props.txHashes.forEach(hash => niceHashes.push(
                <div>
                    <p className="hash">{hash}</p>
                    <div className="hash-separator"/>
                </div>
            ));
            return niceHashes;
        }
    }

    render() {
        let hashes = this.generateHashes();
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
                            <h6 className="send-label">Recipient</h6>
                            <input className="send-input"
                                   type="text" value={this.state.recipient}
                                   placeholder="Recipient"
                                   onChange={input => this.setState({recipient: input.target.value})}
                            />
                        </div>

                        <div className="row">
                            <h6 className="send-label">Amount</h6>
                            <input className="send-input" type="text"
                                   value={this.state.amount}
                                   placeholder="0.0"
                                   onChange={input => this.setState({amount: input.target.value})}
                            />
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
                                    <i class="fa fa-arrow-down" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="balance-container">
                                <p className="balance-value">{this.props.balance}&nbsp;</p>
                                <p className="balance-currency">LHAU</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
        }
    }
}