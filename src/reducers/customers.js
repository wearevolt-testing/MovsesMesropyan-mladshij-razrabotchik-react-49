import * as types from '../constants/actionTypes'

const INITIAL_STATE = {
    customersList: [],
    customerModal: {}
};


const CustomersReducer = (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_CUSTOMER_LIST:
        case types.UPDATE_CUSTOMER_LIST:
            return Object.assign({}, state, {customersList: action.payload});
        case types.OPEN_CUSTOMER_MODAL:
            return Object.assign({}, state, {customerModal: action.payload});
        case types.CLOSE_CUSTOMER_MODAL:
            return Object.assign({}, state, {customerModal: action.payload});
        default:
            return state;
    }
};

export default CustomersReducer;
