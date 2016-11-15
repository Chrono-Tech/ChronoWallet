import { Map } from 'immutable';

const init = Map({});

export default function reducer(state = init, action) {
    switch(action.type){
        case 'CONFIGURE':{
            return state.merge(action.payload);
        }
        default:
            return state
    }
}