import * as types from '../constants/actionTypes'

const INITIAL_STATE = {
    invoicesList: [],
    invoice: [],
    invoiceElements: [],
    invoiceProductMeta: [],
    invoiceCustomerMeta: [],
    invoiceModal: {}
};


const InvoicesReducer = (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case types.GET_INVOICE_LIST:
        case types.UPDATE_INVOICE_LIST:
            return Object.assign({}, state, {invoicesList: action.payload});
        case types.GET_INVOICE_PRODUCT_META:
            return Object.assign({}, state, {invoiceProductMeta: action.payload});
        case types.GET_INVOICE_CUSTOMER_META:
            return Object.assign({}, state, {invoiceCustomerMeta: action.payload});
        case types.GET_INVOICE:
        case types.UPDATE_INVOICE:
            return Object.assign({}, state, {invoice: action.payload});
        case types.GET_INVOICE_ELEMENTS:
            return Object.assign({}, state, {invoiceElements: action.payload});
        case types.OPEN_INVOICE_MODAL:
            return Object.assign({}, state, {invoiceModal: action.payload});
        case types.CLOSE_INVOICE_MODAL:
            return Object.assign({}, state, {invoiceModal: action.payload});
        default:
            return state;
    }
};

export default InvoicesReducer;
