import Promise from 'bluebird';
import config from '../config';
import store from'../store';
import {Map, List} from 'immutable';

export function configure() {
    let contracts = config.contractAddresses.map(address => {
        return Promise.promisifyAll((web3.eth.contract(config.contractABI)).at(address));
    });
    return {
        type: 'CONFIGURE',
        payload: {
            contracts: contracts
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
        setCurrentAccount(accounts[0]);
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
}

export function getBalances() {
    let contracts = store.getState().get('contracts');
    let account = store.getState().get('currentAccount');
    return Promise.map(contracts, (contract) => {
        return Promise.all([contract.symbolAsync(), contract.balanceOfAsync(account), contract.balanceOfAsync(account, 'pending')])
            .then(([symbol, balance, pending]) => Map({
                symbol: web3.toAscii(symbol),
                balance: balance.div(Math.pow(10, 8)).toNumber(),
                pending: pending.minus(balance).div(Math.pow(10, 8)).toNumber(),
                contract: contract
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
    let value = Math.trunc(parseFloat(amount) * Math.pow(10, 8));
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
