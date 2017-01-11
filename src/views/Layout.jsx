import React from "react";
import NavBar from "../components/NavBar";
import Popup from "../components/Popup";
import store from "../store";
import {configure, getAccounts} from "../actions";

export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            popup: null
        };
        this.showPopup = this.showPopup.bind(this);
        this.closePopup = this.closePopup.bind(this);
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

    showPopup(header, text, buttontext, custom) {
        if (custom) {
            this.setState ({popup: <Popup closePopup={this.closePopup}
                          custom={custom}/>})
        } else {
            this.setState({popup: <Popup closePopup={this.closePopup}
                          header={header}
                          text={text}
                          buttonText={buttontext}/>})
        }
    }

    closePopup() {
        this.setState({popup: null});
    }

    render() {
        // let accountsCount = store.getState().get('accounts') ? store.getState().get('accounts').size : null;
        if (typeof web3 === 'undefined') {
            return (<div className="container transparent-box text-center vertical-align">
                <p className="blue-big">Chrono</p>
                <p className="yellow-big">Wallet</p>
                <h1>This browser doesn't support Web3. Use browser like Mist or install
                    Metamask.</h1>
            </div>);
        } else if (this.state.loading) {
            return (
                <image src="../assets/cat1.gif" className="main-loader-cat"/>
            );
        } else if (store.getState().get('accounts').size > 0) {
            return (
                <div className="container" style={{"position": "relative"}}>
                    {this.state.popup}
                    <NavBar/>
                    {React.cloneElement(this.props.children, {showPopup: this.showPopup})}
                </div>
            );
        } else {
            return (
                <div className="big-box text-center">
                    <p className="blue-big">Chrono</p>
                    <p className="yellow-big">Wallet</p>
                    <h1>To use wallet please connect your address.</h1>
                </div>
            );
        }
    }

}