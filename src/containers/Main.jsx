import React, { Component } from 'react';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './Navigation';
import Home from './Home';
import Invoices from './Invoices';
import InvoiceEdit from './invoice';
import Customers from './Customers';
import Products from './Products';

import CustomerModal from '../components/customerModal';
import ProductModal from '../components/productModal';


export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
          <BrowserRouter>
              <div className="main-container">
                  <Navigation />
                  <Switch>
                      <Route exact path='/' component={Home}/>
                      <Route exact path='/customers' component={Customers}/>
                      <Route exact path='/products' component={Products}/>
                      <Route exact path='/invoices' component={Invoices}/>
                      <Route exact path='/invoices/create' component={InvoiceEdit}/>
                      <Redirect to='/' />
                  </Switch>
                  <ProductModal />
                  <CustomerModal />
              </div>
          </BrowserRouter>
      );
  }
}
