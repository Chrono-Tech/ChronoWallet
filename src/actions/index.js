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
        web3.eth.defaultAccount = accounts[1];
        store.dispatch({
            type: 'SET_ACCOUNTS',
            payload: {
                accounts: accounts
            }
        });
        store.dispatch({
            type: 'SET_CURRENT_ACCOUNT',
            payload: {
                currentAccount: accounts[1]
            }
        });
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
}

export function getBalances() {
    let contracts = store.getState().get('contracts');
    let account = web3.eth.defaultAccount;
    return Promise.map(contracts, (contract) => {
        return Promise.all([contract.symbolAsync(), contract.balanceOfAsync(account), contract.balanceOfAsync(account, 'pending')])
            .then(([symbol, balance, pending]) => Map({
                symbol: web3.toAscii(symbol),
                balance: balance.toString(),
                pending: pending.minus(balance).toString()
            }))
    }).then(entries => {
        let balances = [];
        entries.forEach(entry => balances.push(entry));
        store.dispatch({
            type: 'SET_BALANCES',
            payload: {
                balances: List(balances)
            }
        });
    });
}

export function send(to, amount, symbol) {
    let contracts = store.getState().get('contracts');


    contract.transferAsync(to, amount).then(hash => {
        store.dispatch({
            type: 'SEND',
            payload: hash
        });
        getBalances();
    });
}
