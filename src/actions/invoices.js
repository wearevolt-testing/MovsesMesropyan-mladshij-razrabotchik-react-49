import * as types from '../constants/actionTypes';
import invoiceAppAPI from '../services/api';

export const getInvoiceProductMeta = () => {
  return (dispatch) => {
    invoiceAppAPI.getProductList().then((response) => {
      if (response.status === 200 && response.data) {
        dispatch({type: types.GET_INVOICE_PRODUCT_META, payload: response.data})
      }
    });
  }
};

export const getInvoiceCustomerMeta = () => {
  return (dispatch) => {
    invoiceAppAPI.getCustomerList().then((response) => {
      if (response.status === 200 && response.data) {
        dispatch({type: types.GET_INVOICE_CUSTOMER_META, payload: response.data})
      }
    })
  }
};

export const getInvoiceList = () => {
  return (dispatch) => {
    dispatch({type: types.DATA_IS_LOADING, payload: true});
    invoiceAppAPI.getInvoiceList().then((response) => {
      dispatch({type: types.DATA_IS_LOADING, payload: false});
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        dispatch({type: types.GET_INVOICE_LIST, payload: response.data})
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
    }, (error) => {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const getInvoice = (invoiceId) => {
  return (dispatch) => {
    dispatch({type: types.DATA_IS_LOADING, payload: true});
    invoiceAppAPI.getInvoice(invoiceId).then((response) => {
      dispatch({type: types.DATA_IS_LOADING, payload: false});
      if (response.status === 200 && response.data && (typeof response.data === 'object')) {
        dispatch({type: types.GET_INVOICE, payload: response.data})
      } else {
        dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
      }
    }, (error) => {
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const createInvoice = (invoice, invoiceItems) => {
  return (dispatch, getState) => {
    return invoiceAppAPI.createInvoice(invoice).then((response) => {
      if (response.status === 200 && response.data) {
        let state = getState();
        if(state && state.invoices && state.invoices.invoicesList) {
          let invoicesList = state.invoices.invoicesList;
          invoicesList.push(response.data);
          dispatch({type: types.UPDATE_INVOICE_LIST, payload: invoicesList})
        }

        if(response.data.id) {
          let invoiceId = response.data.id;
          let promises = [];
          invoiceItems.map((item, i) => {
            let invoiceItemToSend = {
              invoice_id: invoiceId,
              product_id: item.product_id,
              quantity: item.quantity
            };
            promises.push(invoiceAppAPI.createInvoiceItem(invoiceId, invoiceItemToSend));
          });
          Promise.all(promises)
              .then((result) => {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Invoice created successfully'}});
              },(error) => {
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
              });
        }
      }
      return response;
    },(error) => {
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const editInvoice = (invoice, invoiceItems) => {
  return (dispatch, getState) => {
    let promises = [];
    invoiceItems.map((item, i) => {
      let invoiceItemToSend = {
        invoice_id: invoice.id,
        product_id: item.product_id,
        quantity: item.quantity
      };
      promises.push(invoiceAppAPI.editInvoice(invoice));

      if(item.id == null) {
        promises.push(invoiceAppAPI.createInvoiceItem(invoice.id, invoiceItemToSend));
      } else if(item.isEdited) {
        invoiceItemToSend.id = item.id;
        promises.push(invoiceAppAPI.editInvoiceItem(invoice.id, invoiceItemToSend));
      } else if(item.isDeleted) {
        promises.push(invoiceAppAPI.deleteInvoiceItem(invoice.id, item.id));
      }
    });
    return Promise.all(promises)
        .then((result) => {
          if(result[0] && result[0].status == 200 && (typeof result[0].data === 'object')) {
            let response = result[0];
            dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Invoice edited successfully'}});
            dispatch({type: types.UPDATE_INVOICE, payload: response.data})
          }
          return result[0];
        },(error) => {
          dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
        });
  }
};

export const deleteInvoice = (invoice) => {
  return (dispatch, getState) => {
    invoiceAppAPI.getInvoiceItems(invoice.id).then((response) => {
      if (response.status === 200) {
        let items = response.data;
        let promises = [];
        items.map((item, i) => {
          promises.push(invoiceAppAPI.deleteInvoiceItem(invoice.id, item.id));
        });
        Promise.all(promises)
            .then((result) => {
              let isAllItemsDeleted = true;
              result.map((item) => {
                isAllItemsDeleted = item.status == 200;
              });
              if(isAllItemsDeleted) {
                invoiceAppAPI.deleteInvoice(invoice.id).then((response) => {
                  if(response.status == 200 && response.data) {
                    let state = getState();
                    if(state && state.invoices && state.invoices.invoicesList) {
                      let invoicesList = state.invoices.invoicesList;
                      let index = -1;
                      invoicesList.map((invoice, i) => {
                        if(response.data.id == invoice.id) {
                          index = i;
                        }
                      });
                      invoicesList.splice(index, 1);
                      dispatch({type: types.UPDATE_INVOICE_LIST, payload: invoicesList});
                      dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
                      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'success', title: 'Success', body: 'Invoice deleted successfully'}});
                    }
                  }
                });
              } else {
                dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
                dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
              }

            });
      }
    },(error) => {
      dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
      dispatch({type: types.ALERT, payload: {showAlert: true, type: 'danger', title: 'Oh snap! You got an error!', body: 'Something went wrong. Please try again'}});
    });
  }
};

export const getInvoiceItems = (invoiceId) => {
  return (dispatch) => {
    invoiceAppAPI.getInvoiceItems(invoiceId).then((response) => {
      if(response.status == 200 && response.data) {
        dispatch({type: types.GET_INVOICE_ITEMS, payload: response.data});
      }
    });
  }
};

export const createInvoiceItem = (invoiceId, item) => {
  return () => {
    return invoiceAppAPI.createInvoiceItem(invoiceId, item)
  }
};

export const editInvoiceItem = (invoiceId, item) => {
  return () => {
    return invoiceAppAPI.editInvoiceItem(invoiceId, item)
  }
};

export const deleteInvoiceItem = (invoiceId, itemId, invoiceItems) => {
  return (dispatch) => {
    let index = -1;
    invoiceItems.map((item, i)=> {
      if(item.id == itemId) {
        index = i;
      }
    });
    if(index > -1) {
      invoiceItems[index]['isDeleted'] = true;
    }
    dispatch({type: types.GET_INVOICE_ITEMS, payload: invoiceItems});
    dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
  }
};

export const openInvoiceModal = (invoice, itemId, invoiceItems) => {
  return (dispatch) => {
    dispatch({type: types.OPEN_INVOICE_MODAL, payload: {invoice, itemId, invoiceItems, showModal: true}});
  }
};

export const closeInvoiceModal = () => {
  return (dispatch) => {
    dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
  }
};