import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';

import * as  CustomersActions from '../actions/customers';
import Spinner from './../components/spinner';

export class Customers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount () {
        document.title = 'Customer List';
        this.props.getCustomerList();
    }

    openModal(customer, action) {
        let clonedCustomer = Object.assign({}, customer);
        this.props.openCustomerModal(clonedCustomer, action);
    }

    render(){
        const { customersList } = this.props.customers;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="marginRight10 floatLeft">Customer List</h1>
                        <Button className="marginTop20 floatLeft" bsStyle="primary" onClick={this.openModal.bind(this, null, 'create')}>Create</Button>
                        <div className="clearfix"></div>
                    </div>
                    <div className="col-lg-12">
                        { this.props.isLoading ?
                        <Spinner />:
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {customersList ? customersList.map((customer, i) =>
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.address}</td>
                                <td>{customer.phone}</td>
                                <td width="150px">
                                    <Button className="marginRight10" bsStyle="warning" onClick={this.openModal.bind(this, customer, 'edit')}>Edit</Button>
                                    <Button bsStyle="danger" onClick={this.openModal.bind(this, customer, 'delete')}>Delete</Button>
                                </td>
                            </tr>
                            ) : null}
                            </tbody>
                        </Table>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ main, customers }) => {
    const { isLoading } = main;

    return {isLoading, customers};
};

export default connect(mapStateToProps, CustomersActions )(Customers)
