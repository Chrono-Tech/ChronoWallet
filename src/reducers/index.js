import {Map} from "immutable";

const init = Map({});

export default function reducer(state = init, action) {
    switch (action.type) {
        case 'CONFIGURE':
        {
            return state.merge(action.payload);
        }
        case 'SET_ACCOUNTS':
        {
            let contract = state.get('contract');
            let balances = [];
            action.payload.accounts.forEach(account => {
                balances.push({
                    account: account,
                    balances: {
                        LHAU: contract.balanceOf(account, 'LHAU'),
                        LHUS: contract.balanceOf(account, 'LHUS'),
                        LHGB: contract.balanceOf(account, 'LHGB'),
                        LHEU: contract.balanceOf(account, 'LHEU')
                    }
                })
            });
            return state.merge({balances: balances});
        }
        case 'SEND':
        {
            let contract = state.get('contract');
            console.log("__ Sender is address:", action.payload.from);
            console.log("__ Recipient is address:", action.payload.to);
            console.log("__ Amount", action.payload.value);
            let hash = contract.transfer(action.payload.to, action.payload.value, {from: action.payload.from});
            console.log("result", hash);
            return state.merge({txHash: hash});
        }
        default:
            return state
    }
}