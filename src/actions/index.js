import Promise from 'bluebird';
import config from '../config';
import store from'../store';
import {Map} from 'immutable';

export function configure() {
    let contract = Promise.promisifyAll(web3.eth.contract(config.contractABI)
        .at(config.contractAddress));
    return {
        type: 'CONFIGURE',
        payload: {
            contract: contract
        }
    }
}

export function getAccounts() {
    let contract = store.getState().get('contract');
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

export function setCurrentAccount(address){
    web3.eth.defaultAccount = address;
    store.dispatch({
        type: 'SET_CURRENT_ACCOUNT',
        payload: {
            currentAccount: address
        }
    });
}

export function getBalance() {
    let contract = store.getState().get('contract');
    let account = web3.eth.defaultAccount;
    return Promise.all([contract.balanceOfAsync(account),
        contract.balanceOfAsync(account, 'pending')])
        .then(coins => Map({
            LHAU: contract.balanceOf(account,'LHAU'),
            LHUS: contract.balanceOf(account,'LHUS'),
            LHGB: contract.balanceOf(account,'LHGB'),
            LHEU: contract.balanceOf(account,'LHEU')
        })).then((balance) => {
            store.dispatch({
                type: 'SET_BALANCE',
                payload: {
                    balance: balance
                }
            });
        });
}

export function send(to, amount) {
    let contract = store.getState().get('contract');
    contract.transferAsync(to, amount).then(hash => {
        store.dispatch({
            type: 'SEND',
            payload: hash
        });
        getBalance();
    });
}
