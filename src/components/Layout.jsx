import React from "react";
import {connect} from "react-redux";
import {configure, getAccounts, send} from "../actions";
import store from "../store";


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
            status: ''
        };
        this.showBalance = this.showBalance.bind(this);
        this.send = this.send.bind(this);
    }

    componentWillMount() {
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
            store.dispatch(getAccounts());
        }

    }

    send() {
        this.setState({status: 'Clicked!'});
        store.dispatch(send(this.state.sender, this.state.recipient, this.state.amount));

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
                        <div className="col-md-6">
                            <p>{entry.get('balances').get('LHAU').toString()} </p>
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
        if (this.props.contract){
            console.log("Woohoo");
            this.props.contract.Transfer('0x710e2f9d630516d3afdd053de584f1fa421e84bc', '0x710e2f9d630516d3afdd053de584f1fa421e84bc').watch(console.log);
        }
        if (typeof web3 == 'undefined') {
            return (<div className="container">
                <h1>Oh no! This browser doesn't support Web3. Use something like Mist.</h1>
            </div>);
        } else {
            return (<div className="container">
                <h1>ChronoWallet here will be.</h1>
                <h2>Balances</h2>
                <div className="col-md-12">
                    {info}
                </div>
                <h2>Send</h2>

                <h6>Sender</h6>
                <input type="text" value={this.state.sender}
                       placeholder="Sender"
                       onChange={input => this.setState({sender:input.target.value})}
                />

                <h6>Recipient</h6>
                <input type="text" value={this.state.recipient}
                       placeholder="Recipient"
                       onChange={input => this.setState({recipient:input.target.value})}
                />

                <h6>Amount</h6>
                <input type="number" value={this.state.amount}
                       placeholder="0.0"
                       onChange={input => this.setState({amount:input.target.value})}
                />

                <button onClick={this.send}>Send</button>
                <h6>{this.props.txHash}</h6>
            </div>);
        }
    }
}