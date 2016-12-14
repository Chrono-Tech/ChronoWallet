import React from "react";
import {connect} from "react-redux";
import {getExchangeRates} from '../actions/index';
import Exchange from '../views/Exchange';
import store from "../store";

@connect((state) => ({
    accounts: state.get('accounts'),
    currentAccount: state.get('currentAccount'),
}))
export default class ExchangeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            operation: 'Sell',
            amount: '', //Variable for input
        };
        this.amountHandler = this.amountHandler.bind(this);
        this.changeOperation = this.changeOperation.bind(this);
    }

    componentWillMount() {
        //If balance already in the store
        if (store.getState().get('exchangeRates')) {
            this.setState({loading: false});
        } else {
            getExchangeRates();
            //Wait while rates are loading to store
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('exchangeRates')) {
                        unsubscribe();
                        this.setState({loading: false});
                    }
                }
            );
        }
    }

    amountHandler(text) {
        return;
    }

    changeOperation() {
        if (this.state.operation === 'Sell') {
            this.setState({operation: 'Buy'})
        } else {
            this.setState({operation: 'Sell'})
        }
    }

    render() {
        console.log('loading in container', this.state.loading);
        return ( this.state.loading ? null :
            <Exchange currentAccount={this.props.currentAccount}
                      exchangeRates={store.getState().get('exchangeRates')}
            />
        );
    }

}