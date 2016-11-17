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
    Promise.map(web3.eth.accounts, account => Promise.all([contract.balanceOfAsync(account),
        contract.balanceOfAsync(account, 'pending')])
        .then(coins => Map({
            account: account,
            balances: Map({
                LHAU: contract.balanceOf(account,'LHAU'),
                LHUS: contract.balanceOf(account,'LHUS'),
                LHGB: contract.balanceOf(account,'LHGB'),
                LHEU: contract.balanceOf(account,'LHEU')
            })
        }))
    ).then((balances) => {
        store.dispatch({
            type: 'SET_BALANCES',
            payload: {
                balances: balances
            }
        });
    });
}

export function send(from, to, amount) {
    let contract = store.getState().get('contract');
    contract.transferAsync(to, amount, {from: from}).then(hash => {
        store.dispatch({
            type: 'SEND',
            payload: {
                txHash: hash
            }
        });
        getAccounts();
    });
}
