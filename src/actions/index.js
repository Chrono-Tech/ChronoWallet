import Promise from "bluebird";

web3.eth = Promise.promisifyAll(web3.eth);

export function configure() {
    let etoken = Promise.promisifyAll(web3.eth.contract(contractABI)
        .at(contractAddress));
    let accounts = web3.eth.accounts;
    console.log("Accounts", accounts);
    return {
        type: 'CONFIGURE',
        payload: {
            etoken: etoken,
            accounts: accounts
        }
    }
}
