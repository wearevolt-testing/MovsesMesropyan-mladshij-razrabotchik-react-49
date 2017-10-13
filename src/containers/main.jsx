import React, { Component } from 'react';
import { BrowserRouter, Link, Switch, Route, Redirect } from 'react-router-dom';

import Navigation from './navigation';
import Home from './home';
import Invoices from './invoices';
import InvoiceEdit from './invoice';
import Customers from './customers';
import Products from './products';

import CustomerModal from '../components/customerModal';
import ProductModal from '../components/productModal';
import InvoiceModal from '../components/invoiceModal';
import GlobalAlert from '../components/globalAlert';


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
                      <Route exact path='/invoices/:id/edit' component={InvoiceEdit}/>
                      <Redirect to='/' />
                  </Switch>
                  <ProductModal />
                  <CustomerModal />
                  <InvoiceModal />
                  <GlobalAlert />
              </div>
          </BrowserRouter>
      );
  }
}
