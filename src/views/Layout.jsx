import React from "react";
import NavBar from "../components/NavBar";
import store from "../store";
import {configure, getAccounts} from "../actions";

export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
            getAccounts();
            //Waiting while loading accounts
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('accounts')) {
                        unsubscribe();
                        this.setState({loading: false});
                    }
                }
            );
        }
    }

    render() {
        let accountsCount = store.getState().get('accounts') ? store.getState().get('accounts').size : null;
        console.log("accountsCount", accountsCount);
        if (typeof web3 === 'undefined') {
            console.log("accountsCount", accountsCount);
            return (<div className="container transparent-box text-center vertical-align">
                <p className="blue-big">Chrono</p>
                <p className="yellow-big">Wallet</p>
                <h1>This browser doesn't support Web3. Use browser like Mist or install
                    Metamask.</h1>
            </div>);
        } else if (this.state.loading) {
            return (
                <image src="../assets/cat1.gif"/>
            );
        } else if (store.getState().get('accounts').size > 0) {
            console.log("accountsCountIn", accountsCount);
            return (
                <div className="container">
                    <NavBar/>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className="big-box text-center">
                    <p className="blue-big">Chrono</p>
                    <p className="yellow-big">Wallet</p>
                    <h1>To use wallet please connect your address.</h1>
                    <h3>(If you are using Mist you can find it in the top right corner.)</h3>
                </div>
            );
        }
    }

}