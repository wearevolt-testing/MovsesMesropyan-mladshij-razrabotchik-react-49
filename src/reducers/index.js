import { combineReducers } from 'redux';
import main from './main';
import customers from './customers';
import products from './products';
import invoices from './invoices';

export default combineReducers({
    main,
    customers,
    products,
    invoices
})