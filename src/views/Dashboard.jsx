import React from "react";
import {connect} from "react-redux";
import {getBalances} from "../actions";
import store from "../store";
import Send from "./Send";
import Balances from "./Balances";
import {List} from "immutable";


@connect((state) => ({
    balances: state.get('balances'),
    txHashes: state.get('txHashes'),
    accounts: state.get('accounts'),
    currentAccount: state.get('currentAccount')
}))
export default class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            intervalID: '',
        };
        this.generateHashes = this.generateHashes.bind(this);
        this.setBalanceUpdater = this.setBalanceUpdater.bind(this);
    }

    componentWillMount() {
        let unsubscribe = store.subscribe(() => {
                if (store.getState().get('currentAccount')) {
                    this.setBalanceUpdater();
                }
                if (store.getState().get('balances')) {
                    unsubscribe();
                    this.setState({loading: false});
                }
            }
        );
    }

    setBalanceUpdater() {
        this.setState({intervalID: setInterval(() => getBalances(), 15000)});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
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

    render() {
        console.log("STORE", store.getState());
        let hashes = this.generateHashes();
        let balances = store.getState().get('balances') ? store.getState().get('balances') : new List();
        return ( this.state.loading ? <image src="../assets/cat1.gif"/>
                :
                <div>
                    <div className="col-md-6">
                        <Send balances={balances}/>

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
                        <Balances currentAccount={this.props.currentAccount}
                                  accounts={this.props.accounts}
                                  balances={balances}
                        />
                    </div>
                </div>
        );

    }
}