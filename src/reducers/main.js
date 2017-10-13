import * as types from '../constants/actionTypes'

const INITIAL_STATE = {
    alert: {showAlert: false, type: 'success', title: '', body: ''}
};

const MainReducer = (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case types.DATA_IS_LOADING:
            return Object.assign({}, state, {isLoading: action.payload});
        case types.ALERT:
            return Object.assign({}, state, {alert: action.payload});
        default:
            return state;
    }
};

export default MainReducer;
