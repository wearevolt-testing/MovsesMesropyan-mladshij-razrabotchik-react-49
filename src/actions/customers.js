import * as types from '../constants/actionTypes';
import invoiceAppAPI from '../services/api';

export const getCustomerList = () => {
  return (dispatch) => {
    dispatch({type: types.DATA_IS_LOADING, payload: true});
    invoiceAppAPI.getCustomerList().then((response) => {
      dispatch({type: types.DATA_IS_LOADING, payload: false});
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        dispatch({type: types.GET_CUSTOMER_LIST, payload: response.data})
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
    }, (error) => {
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const createCustomer = (customer) => {
  return (dispatch, getState) => {
    invoiceAppAPI.createCustomer(customer).then((response) => {
      if (response.status === 200 && response.data && (typeof response.data === 'object')) {
        let state = getState();
        if(state && state.customers && state.customers.customersList) {
          let customersList = state.customers.customersList;
          customersList.push(response.data);
          dispatch({type: types.UPDATE_CUSTOMER_LIST, payload: customersList})
        }
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Customer created successfully'}});
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
    }, (error) => {
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const editCustomer = (customer) => {
  return (dispatch, getState) => {
    invoiceAppAPI.editCustomer(customer).then((response) => {
      if (response.status === 200 && response.data && (typeof response.data === 'object')) {
        let state = getState();
        if(state && state.customers && state.customers.customersList) {
          let customersList = state.customers.customersList;
          let index = customersList.findIndex(item => item.id === customer.id);
          customersList[index] = customer;
          dispatch({type: types.UPDATE_CUSTOMER_LIST, payload: customersList})
        }
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Customer edited successfully'}});
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
    }, (error) => {
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const deleteCustomer = (customer) => {
  return (dispatch, getState) => {
    invoiceAppAPI.deleteCustomer(customer).then((response) => {
      if (response.status === 200 && response.data && (typeof response.data === 'object')) {
        let state = getState();
        if(state && state.customers && state.customers.customersList) {
          let customersList = state.customers.customersList;
          let index = customersList.findIndex(item => item.id === customer.id);
          customersList.splice(index, 1);
          dispatch({type: types.UPDATE_CUSTOMER_LIST, payload: customersList})
        }
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Customer deleted successfully'}});
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
    }, (error) => {
      dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const openCustomerModal = (customer, action) => {
  return (dispatch) => {
    dispatch({type: types.OPEN_CUSTOMER_MODAL, payload: {customer, action, showModal: true}});
  }
};

export const closeCustomerModal = () => {
  return (dispatch) => {
    dispatch({type: types.CLOSE_CUSTOMER_MODAL, payload: {customer: null, showModal: false}});
  }
};