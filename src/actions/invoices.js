import * as types from '../constants/actionTypes';
import invoiceAppAPI from '../services/api';

export const getInvoiceList = () => {
  return (dispatch) => {
    dispatch({type: types.DATA_IS_LOADING, payload: true});
    invoiceAppAPI.getInvoiceList().then((response) => {
      dispatch({type: types.DATA_IS_LOADING, payload: false});
      if (response.status === 200 && response.data) {
        dispatch({type: types.GET_INVOICE_LIST, payload: response.data})
      }
    })
  }
};

export const getInvoiceElements = () => {//TODO for testing
  return (dispatch) => {
    invoiceAppAPI.getInvoiceElements().then((response) => {
      //debugger;
      if (response.status === 200 && response.data) {
        console.log(response.data);
      }
    })
  }
};

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

export const createInvoice = (invoice, invoiceElements) => {
  return (dispatch, getState) => {
    invoiceAppAPI.createInvoice(invoice).then((response) => {
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

          for(let element in invoiceElements) {
            let invoiceElementToSend = {
              invoice_id: invoiceId,
              product_id: element,
              quantity: invoiceElements[element].quantity
            };
            promises.push(invoiceAppAPI.createInvoiceElements(invoiceId, invoiceElementToSend));
          }
          Promise.all(promises)
              .then((result) => {
                /*dispatch({type: types.LOAD_MONETIZATION_DATA, payload: result})
                dispatch({type: types.ITEM_FINISHED_LOADING})*/
                console.log(result);
              });
        }
      }
    });
  }
};

export const deleteInvoice = (invoice) => {
  return (dispatch, getState) => {
    invoiceAppAPI.getInvoiceElements(invoice.id).then((response) => {
      if (response.status === 200) {
        let elements = response.data;
        let promises = [];
        elements.map((element, i) => {
          promises.push(invoiceAppAPI.deleteInvoiceElement(invoice.id, element.id));
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
                    }

                  }
                });
              }
            });
      }
    });
  }
};

export const openInvoicesModal = (invoice, action) => {
  return (dispatch) => {
    dispatch({type: types.OPEN_INVOICE_MODAL, payload: {invoice, action, showModal: true}});
  }
};

export const closeInvoicesModal = () => {
  return (dispatch) => {
    dispatch({type: types.CLOSE_INVOICE_MODAL, payload: {invoice: null, showModal: false}});
  }
};