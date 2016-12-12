import React from "react";
import {connect} from "react-redux";
import {getBalances} from "../actions";
import store from "../store";
import SendContainer from "../containers/SendContainer";
import Balances from "../components/Balances";
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
        //If balance already in the store
        if (store.getState().get('balances')) {
            this.setBalanceUpdater();
            this.setState({loading: false});
        } else { //Wait while balance loading to store
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('balances')) {
                        unsubscribe();
                        this.setBalanceUpdater();
                        this.setState({loading: false});
                    }
                }
            );
        }
    }

    setBalanceUpdater() {
        this.setState({intervalID: setInterval(() => getBalances(), 10000)});
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
                        <SendContainer balances={balances}/>

                        {this.props.txHashes ?
                            <div className="transparent-box">
                                <div className="row">
                                    <h2>Transaction Hashes</h2>
                                </div>

                                <div className="row">
                                    <div className="hash-container text-center">
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