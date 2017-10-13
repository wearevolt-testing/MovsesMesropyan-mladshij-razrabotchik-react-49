import * as types from '../constants/actionTypes';

export const closeAlert = () => {
  return (dispatch) => {
    dispatch({type: types.ALERT, payload: {showAlert: false, type: 'success', title: '', body: ''}});
  }
};