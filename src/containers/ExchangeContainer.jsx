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
            result: 0,
            exchangeCurrency: 'ETH',
            exchangeCurrencies: [],
            currentCurrencyBalance: 0, //BigNumber
            currentCurrency: '',
            currentCurrencies: []
        };
        this.amountHandler = this.amountHandler.bind(this);
        this.changeOperation = this.changeOperation.bind(this);
        this.pickCurrency = this.pickCurrency.bind(this);
    }

    componentWillMount() {
        //If rates are already in the store
        if (store.getState().get('exchangeRates')) {
            this.setState({loading: false});
            this.pickCurrency();
        } else {
            getExchangeRates();
            //Else wait while rates are loading to store
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('exchangeRates') && store.getState().get('balances')) {
                        unsubscribe();
                        this.setState({loading: false});
                        this.pickCurrency();
                    }
                }
            );
        }
    }

    pickCurrency(currency) {
        //TODO add exchange currencies in future here
        let currentCurrency = currency;
        let currentCurrencies = [];
        let balances = store.getState().get('balances');
        if (!currency) {
            currentCurrency = balances.get(0).get('symbol');
        }
        balances.forEach(balance => {
            if (balance.get('symbol') === currentCurrency) {
                return;
            }
            currentCurrencies.push(balance.get('symbol'));
        });
        this.setState({currentCurrency: currentCurrency, currentCurrencies: currentCurrencies});
    }

    amountHandler(text) {
        this.setState({amount: text, result: parseFloat(text) * 0.5});
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
        let inputCurrency;
        let inputCurrencies;
        let outputCurrency;
        let outputCurrencies;
        if (this.state.operation === 'Sell') {
            inputCurrency = this.state.currentCurrency;
            inputCurrencies = this.state.currentCurrencies;
            outputCurrency = this.state.exchangeCurrency;
            outputCurrencies = this.state.exchangeCurrencies;
        } else {
            inputCurrency = this.state.exchangeCurrency;
            inputCurrencies = this.state.exchangeCurrencies;
            outputCurrency = this.state.currentCurrency;
            outputCurrencies = this.state.currentCurrencies;
        }
        return ( this.state.loading ?
                <image src="../assets/cat1.gif" className="main-loader-cat"/> :
                <Exchange currentAccount={this.props.currentAccount}
                          operation={this.state.operation}
                          changeOperation={this.changeOperation}
                          exchangeRates={store.getState().get('exchangeRates')}
                          amount={this.state.amount}
                          amountHandler={this.amountHandler}
                          inputCurrency={inputCurrency}
                          inputCurrencies={inputCurrencies}
                          outputCurrency={outputCurrency}
                          outputCurrencies={outputCurrencies}
                          result={this.state.result}
                          pickCurrency={this.pickCurrency}
                />
        );
    }

}