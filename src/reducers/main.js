import * as types from '../constants/actionTypes'


const MainReducer = (state = {}, action = {}) => {
    switch (action.type) {
        case types.DATA_IS_LOADING:
            return Object.assign({}, state, {isLoading: action.payload});
        default:
            return state;
    }
};

export default MainReducer;
