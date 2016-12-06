import React from "react";
import NavBar from "../components/NavBar";
import store from "../store";
import {configure, getAccounts} from "../actions";

export default class Layout extends React.Component {

    componentWillMount(){
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
            getAccounts();
        }
    }

    render() {
        if (typeof web3 === 'undefined') {
            return (<div className="container transparent-box text-center vertical-align">
                <p className="blue-big">Chrono</p>
                <p className="yellow-big">Wallet</p>
                <h1>This browser doesn't support Web3. Use browser like Mist or install
                    Metamask.</h1>
            </div>);
        } else {
            return (
                <div className="container">
                    <NavBar/>
                    {this.props.children}
                </div>
            );
        }
    }

}