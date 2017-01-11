import React from "react";
import {connect} from "react-redux";
import {getExchangeRates, sell, buy} from '../actions/index';
import Exchange from '../views/Exchange';
import store from "../store";
import {List} from "immutable";
import BigNumber from "bignumber.js";


@connect((state) => ({
    accounts: state.get('accounts'),
    currentAccount: state.get('currentAccount'),
}))
export default class ExchangeContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            balances: new List(),
            loading: true,
            amount: '', //Variable for input
            amountInputError: '',
            result: 0,
            operation: 'sell', //Meaning one of currentCurrencies is an inputCurrency

            //only symbols here
            //arrays containing exchangeable currencies
            exchangeCurrencies: ['ETH'], //Other cryptocurrencies in future
            currentCurrencies: [], //Taken from balances

            //arrays for ease of showing
            inputCurrency: '', //Selected currency, should not be included in inputCurrencies and outputCurrencies
            inputCurrencies: [],
            outputCurrency: '', //Selected currency, should not be included in outputCurrencies
            outputCurrencies: []
        };
        this.setInitialState = this.setInitialState.bind(this);
        this.amountHandler = this.amountHandler.bind(this);
        this.defineError = this.defineError.bind(this);
        this.pickInputCurrency = this.pickInputCurrency.bind(this);
        this.pickOutputCurrency = this.pickOutputCurrency.bind(this);
        this.beforeExchangeChecksWithPopups = this.beforeExchangeChecksWithPopups.bind(this);
        this.makeExchange = this.makeExchange.bind(this);
    }

    setInitialState() {
        let currentCurrencies = [];
        let exchangeCurrencies = this.state.exchangeCurrencies;
        store.getState().get('exchangeRates').forEach(rate => {
            currentCurrencies.push(rate.get('symbol'));
        });
        this.setState({
            loading: false,
            balances: store.getState().get('balances'),
            currentCurrencies: currentCurrencies,
            inputCurrency: currentCurrencies[0],
            inputCurrencies: currentCurrencies.slice(1).concat(exchangeCurrencies),
            outputCurrency: exchangeCurrencies[0],
            outputCurrencies: exchangeCurrencies.slice(1)
        });
    }

    componentWillMount() {
        //If rates are already in the store
        if (store.getState().get('exchangeRates')) {
            this.setState({loading: false, balances: store.getState().get('balances')});
            this.setInitialState();
        } else {
            getExchangeRates();
            //Else wait while rates are loading to store
            let unsubscribe = store.subscribe(() => {
                    if (store.getState().get('exchangeRates') && store.getState().get('balances')) {
                        unsubscribe();
                        this.setInitialState()
                    }
                }
            );
        }
        this.setState({
            updater: store.subscribe(() => {
                let balances = store.getState().get('balances');
                if (balances) {
                    this.setState({balances: balances});
                }
            })
        });
    }

    componentWillUnmount() {
        this.state.updater();
    }

    pickInputCurrency(currency) {
        let exchangeCurrencies = this.state.exchangeCurrencies;
        let currentCurrencies = this.state.currentCurrencies;
        let inputCurrencies = currentCurrencies.concat(exchangeCurrencies)
            .filter(cur => cur !== currency);

        let amount = this.state.amount;
        if (this.state.currentCurrencies.includes(currency)) {
            this.setState({
                inputCurrency: currency,
                inputCurrencies: inputCurrencies,
                outputCurrency: exchangeCurrencies[0],
                outputCurrencies: exchangeCurrencies.slice(1),
                amountInputError: this.defineError(amount, currency),
                operation: 'sell'
            });
        } else {
            this.setState({
                inputCurrency: currency,
                inputCurrencies: inputCurrencies,
                outputCurrency: currentCurrencies[0],
                outputCurrencies: currentCurrencies.slice(1),
                amountInputError: this.defineError(amount, currency),
                operation: 'buy'
            });
        }
    }

    pickOutputCurrency(currency) {
        let outputCurrencies = this.state.outputCurrencies.filter(cur => cur !== currency).concat(this.state.outputCurrency);
        this.setState({outputCurrency: currency, outputCurrencies: outputCurrencies});
    }

    defineError(text, currency) { //TODO add balance check!!!!!!
        if (!currency) {
            currency = this.state.inputCurrency;
        }

        if (text !== '' && isNaN(text)) {
            return 'Not a number.';
        } else if (text.startsWith('-')) {
            return 'Has to be positive number.';
        } else if (this.state.operation === 'sell' //If it is LH*
            && !/^\d*[\.]?\d{0,8}$/.test(text.replace(/\.?0+$/, ""))) {
            return 'You can\'t send amount having more than 8 decimal places';
        } else if (currency === 'ETH'
            && !/^\d*[\.]?\d{0,18}$/.test(text.replace(/\.?0+$/, ""))) {
            return 'You can\'t send amount having more than 18 decimal places';
        } else {
            return '';
        }
    }

    amountHandler(text) {
        let error = this.defineError(text);
        let result = '0';
        if (text !== '' && error === '') {
            if (this.state.operation == 'sell') {
                let rate = store.getState().get('exchangeRates')
                    .find(rate => rate.get('symbol') === this.state.inputCurrency)
                    .get('buyPrice');
                result = new BigNumber(text).times(rate).toFixed(18).replace(/\.?0+$/, "");
            } else {
                let rate = store.getState().get('exchangeRates')
                    .find(rate => rate.get('symbol') === this.state.outputCurrency)
                    .get('sellPrice');
                result = new BigNumber(text).div(rate).toFixed(8).replace(/\.?0+$/, "");
            }
        }
        this.setState({
            amount: text,
            result: result,
            amountInputError: error
        });
    }

    beforeExchangeChecksWithPopups() {
        // if(this.state.balances.find(balance => balance.get('symbol') === ))
        if (this.state.amount === '') {
            this.setState({amountInputError: 'This field is required.'});
        } else if (this.state.result === '0') {
            this.props.showPopup('Warning', 'You can\'t exchange something for 0. Pick bigger amount.');
        }
    }

    makeExchange() {
        this.beforeExchangeChecksWithPopups();
        if(this.state.operation === 'sell'){
            sell(this.state.amount, this.state.inputCurrency);
        } else {
            buy(this.state.result, this.state.outputCurrency);
        }
    } // 293.88938699

    render() {
        return ( this.state.loading ?
                <image src="../assets/cat1.gif" className="main-loader-cat"/> :
                <Exchange currentAccount={this.props.currentAccount}
                          exchangeRates={store.getState().get('exchangeRates')}
                          balances={this.state.balances}
                          amount={this.state.amount}
                          amountInputError={this.state.amountInputError}
                          amountHandler={this.amountHandler}
                          inputCurrency={this.state.inputCurrency}
                          inputCurrencies={this.state.inputCurrencies}
                          outputCurrency={this.state.outputCurrency}
                          outputCurrencies={this.state.outputCurrencies}
                          result={this.state.result}
                          pickInputCurrency={this.pickInputCurrency}
                          pickOutputCurrency={this.pickOutputCurrency}
                          showPopup={this.props.showPopup}
                          exchange={this.makeExchange}
                />
        );
    }

}