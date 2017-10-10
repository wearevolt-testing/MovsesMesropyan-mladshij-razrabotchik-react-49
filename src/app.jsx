import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Main from 'containers/Main';
import 'react-select/dist/react-select.css';
import './styles/baseStyles.css';

/* REDUCERS */
import reducers from './reducers/index';

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = (process.env.NODE_ENV !== 'production') ? createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk))) : createStore(reducers, {}, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <Main />
    </Provider>,
    document.getElementById('app-root')
);
