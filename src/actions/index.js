import Promise from 'bluebird';
import config from '../config';
import store from'../store';
import {Map} from 'immutable';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export function configure() {
    let contracts = config.contractAddresses.map(address => {
        return Promise.promisifyAll((web3.eth.contract(config.contractABI)).at(address));
    });
    let exchangeContracts = config.exchangeContract.map(address => {
        return Promise.promisifyAll((web3.eth.contract(config.exchangeABI)).at(address));
    });
    return {
        type: 'CONFIGURE',
        payload: {
            contracts: contracts,
            exchangeContracts: exchangeContracts
        }
    }
}

export function getAccounts() {
    Promise.all(web3.eth.accounts).then((accounts) => {
        store.dispatch({
            type: 'SET_ACCOUNTS',
            payload: {
                accounts: accounts
            }
        });
        if (accounts.length !== 0) {
            setCurrentAccount(accounts[0]);
        }
    });
}

export function setCurrentAccount(address) {
    web3.eth.defaultAccount = address;
    store.dispatch({
        type: 'SET_CURRENT_ACCOUNT',
        payload: {
            currentAccount: address
        }
    });
    getBalances();
    setUpTransferListeners(address);
}

function setUpTransferListeners(address) {
    let contracts = store.getState().get('contracts');
    let listeners = store.getState().get('listeners');
    if (listeners) {
        listeners.forEach(listener => listener.stopWatching());
    }
    return Promise.map(contracts, contract => contract.Transfer({to: address}, (err, result) => {
        if (err) {
            console.log('ParseTransferError', err);
        } else {
            parseTransfer(result);
            getBalances();
        }
    })).then(listeners =>
        store.dispatch({
            type: 'SET_LISTENERS',
            payload: listeners
        })
    );
}

function parseTransfer(transfer) {
    console.log('ParseTransferResult', transfer);
}

export function getBalances() {
    let contracts = store.getState().get('contracts');
    let account = store.getState().get('currentAccount');
    let days = moment().diff(moment([2016, 11, 1]), 'days');
    return Promise.map(contracts, (contract, index) => {
        return Promise.all([contract.symbolAsync(), contract.balanceOfAsync(account), contract.balanceOfAsync(account, 'pending')])
            .then(([symbol, balance, pending]) => Map({
                symbol: web3.toAscii(symbol),
                balance: balance.div(Math.pow(10, 8)).toNumber(),
                pending: pending.minus(balance).div(Math.pow(10, 8)).toNumber(),
                fiatSymbol: config.fiat[index],
                fiatRate: new BigNumber(config.fiatStartRate[index]).plus(new BigNumber(config.fiatRatio[index]).times(new BigNumber(days))),
                fee: new BigNumber(config.fee[index]),
                contract: contract,
            }))
    }).then(entries => {
        let balances = [];
        entries.forEach(entry => balances.push(entry));
        store.dispatch({
            type: 'SET_BALANCES',
            payload: balances
        });
    });
}

export function send(to, amount, symbol) {
    let value = new BigNumber(amount).times(Math.pow(10, 8)).toString();
    let balances = store.getState().get('balances');
    let contract = balances.filter(balance => balance.get('symbol') === symbol).get(0).get('contract');
    contract.transferAsync(to, value).then(hash => {
        store.dispatch({
            type: 'SEND',
            payload: hash
        });
        getBalances();
    });
}

export function getExchangeRates() {
    let exchangeContracts = store.getState().get('exchangeContracts');
    let contracts = store.getState().get('contracts');
    return Promise.map(exchangeContracts, (contract, index) => {
        return Promise.all([contract.sellPriceAsync(), contract.buyPriceAsync(), contracts.get(index).symbolAsync()])
            .then(([sellPrice, buyPrice, symbol]) => Map({
                symbol: web3.toAscii(symbol),
                sellPrice: web3.fromWei(sellPrice.toString()),
                buyPrice: web3.fromWei(buyPrice.toString())
            }))
    }).then(entries => {
        let exchangeRates = [];
        entries.forEach(entry => exchangeRates.push(entry));
        store.dispatch({
            type: 'SET_EXCHANGE_RATES',
            payload: exchangeRates
        });
    });
}