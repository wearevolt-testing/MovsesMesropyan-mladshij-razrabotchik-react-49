import * as types from '../constants/actionTypes'

const INITIAL_STATE = {
    productsList: [],
    productModal: {}
};

const ProductsReducer = (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_PRODUCT_LIST:
        case types.UPDATE_PRODUCT_LIST:
            return Object.assign({}, state, {productsList: action.payload});
        case types.OPEN_PRODUCT_MODAL:
            return Object.assign({}, state, {productModal: action.payload});
        case types.CLOSE_PRODUCT_MODAL:
            return Object.assign({}, state, {productModal: action.payload});
        default:
            return state;
    }
};

export default ProductsReducer;
