import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavLink } from 'react-bootstrap'

export default class Navigation extends React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/">
                <a>Invoice App</a>
              </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/invoices" activeClassName="active">
                <NavItem>Invoices</NavItem>
              </LinkContainer>
              <LinkContainer to="/products" activeClassName="active">
                <NavItem>Products</NavItem>
              </LinkContainer>
              <LinkContainer to="/customers" activeClassName="active">
                <NavItem>Customers</NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
    )
  }
}
