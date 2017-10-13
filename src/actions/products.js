import * as types from '../constants/actionTypes';
import invoiceAppAPI from '../services/api';

export const getProductList = () => {
    return (dispatch) => {
        dispatch({type: types.DATA_IS_LOADING, payload: true});
        invoiceAppAPI.getProductList().then((response) => {
            dispatch({type: types.DATA_IS_LOADING, payload: false});
            if (response.status === 200 && response.data && Array.isArray(response.data)) {
                dispatch({type: types.GET_PRODUCT_LIST, payload: response.data})
            } else {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
            }
        }, (error) => {
            dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
        });
    }
};

export const createProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.createProduct(product).then((response) => {
            if (response.status === 200 && response.data && (typeof response.data === 'object')) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    productsList.push(response.data);
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Product created successfully'}});
            } else {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
            }
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
        }, (error) => {
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
        });
    }
};

export const editProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.editProduct(product).then((response) => {
            if (response.status === 200 && response.data && (typeof response.data === 'object')) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    let index = productsList.findIndex(item => item.id === product.id);
                    productsList[index] = product;
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Product edited successfully'}});
            } else {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
            }
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
        }, (error) => {
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
        });
    }
};

export const deleteProduct = (product) => {
    return (dispatch, getState) => {
        invoiceAppAPI.deleteProduct(product).then((response) => {
            if (response.status === 200 && response.data && (typeof response.data === 'object')) {
                let state = getState();
                if(state && state.products && state.products.productsList) {
                    let productsList = state.products.productsList;
                    let index = productsList.findIndex(item => item.id === product.id);
                    productsList.splice(index, 1);
                    dispatch({type: types.UPDATE_PRODUCT_LIST, payload: productsList})
                }
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Product deleted successfully'}});
            } else {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
            }
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
        }, (error) => {
            dispatch({type: types.CLOSE_PRODUCT_MODAL, payload: {product: null, showModal: false}});
            dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
        });
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