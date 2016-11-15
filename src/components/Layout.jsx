import React from 'react';
import {connect} from 'react-redux';
import {configure} from '../actions';
import store from '../store';


@connect((store) => {
    return {
        etoken: store.get('etoken'),
        accounts: store.get('accounts')
    };
})
export default class Layout extends React.Component {

    constructor() {
        super();
        this.state = {
            etoken: store.getState().get('etoken')
        }
    }

    componentWillMount() {
        if (typeof web3 !== 'undefined') {
            store.dispatch(configure());
        }
    }

    render() {
        if (typeof web3 == 'undefined') {
            return (<div className="container">
                <h1>Oh no! This browser doesn't support Web3. Use something like Mint.</h1>
            </div>);
        } else {
            console.log('Accounts', this.props.accounts);
            return(<div>
                <h1>ChronoWallet here will be.</h1>
                {this.props.accounts}
            </div>);
        }
    }
}