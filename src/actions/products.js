import * as types from '../constants/actionTypes';
import invoiceAppAPI from '../services/api';

export const getProductList = () => {
    return (dispatch, getState) => {
        dispatch({type: types.DATA_IS_LOADING, payload: true});
        invoiceAppAPI.getProductList().then((response) => {
            dispatch({type: types.DATA_IS_LOADING, payload: false});
            if (response.status === 200 && response.data) {
                dispatch({type: types.GET_PRODUCT_LIST, payload: response.data})
            }
        })
    }
};

export const createProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.createProduct(product).then((response) => {
            if (response.status === 200) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    productsList.push(response.data);
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            }
        })
    }
};

export const editProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.editProduct(product).then((response) => {
            if (response.status === 200) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    let index = productsList.findIndex(item => item.id === product.id);
                    productsList[index] = product;
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            }
        })
    }
};

export const deleteProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.deleteProduct(product).then((response) => {
            if (response.status === 200) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    let index = productsList.findIndex(item => item.id === product.id);
                    productsList.splice(index, 1);
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            }
        })
    }
};

export const openProductModal = (product, action) => {
    return (dispatch) => {
        dispatch({type: types.OPEN_PRODUCT_MODAL, payload: {product, action, showModal: true}});
    }
};

export const closeProductModal = () => {
    return (dispatch) => {
        dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
    }
};