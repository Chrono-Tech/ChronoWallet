import React from "react";
import {connect} from "react-redux";
import {configure, getAccounts, send} from "../actions";
import store from "../store";
import NavBar from "../components/NavBar";


@connect((store) => {
    return {
        balances: store.get('balances'),
        txHash: store.get('txHash'),
        contract: store.get('contract')
    };
})
export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            sender: '0x710e2f9d630516d3afdd053de584f1fa421e84bc',
            recipient: '0x499388416d3cac5f056cb8d358d5be100271cc51',
            amount: '10',
            status: '',
            intervalID: ''
        };
        this.showBalance = this.showBalance.bind(this);
        this.setBalanceUpdater = this.setBalanceUpdater.bind(this);
        this.send = this.send.bind(this);
    }

    componentWillMount() {
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
            getAccounts();
            this.setBalanceUpdater();
        }

    }

    setBalanceUpdater() {
        this.setState({intervalID: setInterval(() => getAccounts(), 15000)});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    send() {
        this.setState({status: 'Clicked!'});
        send(this.state.sender, this.state.recipient, this.state.amount);
    }

    showBalance() {
        if (this.props.balances && this.props.balances.size > 0) {
            let balanceInfo = [];
            this.props.balances.forEach(entry => {
                balanceInfo.push(
                    <div key={entry.get('account')} className="row">
                        <div className="col-md-6">
                            <h6>{entry.get('account')}</h6>
                        </div>
                        <div className="col-md-3">
                            <p>{entry.get('balances').get('LHAU')} </p>
                        </div>
                        <div className="col-md-3">
                            <p>{entry.get('balances').get('LHAUpending')} </p>
                        </div>
                    </div>
                )
            });
            return balanceInfo;
        } else {
            return <h6>There is no address connected.</h6>
        }
    }

    render() {
        let info = this.showBalance();
        if (typeof web3 == 'undefined') {
            return (<div className="container">
                <h1>Oh no! This browser doesn't support Web3. Use something like Mist.</h1>
            </div>);
        } else {
            return (<div className="container">
                <NavBar/>

                <div className="col-md-6">
                    <div className="row">
                        <h2>Send</h2>
                    </div>
                    <div className="row">
                        <h6 className="send-label">Sender</h6>
                        <input className="send-input" type="text" value={this.state.sender}
                               placeholder="Sender"
                               onChange={input => this.setState({sender: input.target.value})}
                        />
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
                        <input className="send-input" type="number" value={this.state.amount}
                               placeholder="0.0"
                               onChange={input => this.setState({amount: input.target.value})}
                        />
                    </div>
                    <div className="row">
                        <button className="send-button" onClick={this.send}>Send</button>
                    </div>
                    <div className="row">
                        <h6>{this.props.txHash}</h6>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <h2>Balances</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {info}
                        </div>
                    </div>
                </div>
            </div>);
        }
    }
}