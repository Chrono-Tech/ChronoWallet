import {Map, List} from 'immutable';

const init = Map({});

export default function reducer(state = init, action) {
    switch (action.type) {
        case 'CONFIGURE': {
            return state.merge(action.payload);
        }
        case 'SET_ACCOUNTS': {
            return state.merge(action.payload);
        }
        case 'SET_CURRENT_ACCOUNT': {
            return state.merge(action.payload);
        }
        case 'SET_BALANCE': {
            return state.merge(action.payload);
        }
        case 'SEND': {
            let hashes;
            if(state.get('txHashes')){
                hashes = state.get('txHashes');
            } else {
                hashes = List();
            }
            return state.merge({txHashes: hashes.push(action.payload)});
        }
        default:
            return state
    }
}