import Promise from 'bluebird';
import config from '../config'

if (typeof web3 !== 'undefined') {
    web3.eth = Promise.promisifyAll(web3.eth);
}

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

export function getAccounts(){
    let accounts = web3.eth.accounts;
    return {
        type: 'SET_ACCOUNTS',
        payload: {
            accounts: accounts
        }
    }
}

export function send(from, to, amount){
    return {
        type: 'SEND',
        payload: {
            from:from,
            to:to,
            value:amount
        }
    }
}
