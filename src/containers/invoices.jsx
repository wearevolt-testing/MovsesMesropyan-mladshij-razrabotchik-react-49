import React from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';

import * as  InvoicesActions from '../actions/invoices';
import Spinner from './../components/spinner';

export class Invoices extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            customerList: {}
        };
    }

    componentDidMount () {
        document.title = 'Invoice List';
        this.props.getInvoiceCustomerMeta();
        this.props.getInvoiceList();
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.invoiceCustomerMeta && (nextProps.invoiceCustomerMeta.length != this.state.customerList.length)) {
            let customerList = nextProps.invoiceCustomerMeta;
            let processedCustomerList = {};
            customerList.map((customer) => {
                processedCustomerList[customer.id] = customer.name;
            });
            this.setState({customerList: processedCustomerList})
        }
    }

    openModal(invoice) {
        this.props.openInvoiceModal(invoice, null);
    }

    redirectTo(invoiceId) {
        this.props.history.push(`/invoices/${invoiceId}/edit`);
    }

    render(){
        const { invoicesList } = this.props.invoices || [];
        const { customerList } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="marginRight10 floatLeft">Invoice List</h1>
                        <LinkContainer to="/invoices/create" activeClassName="active">
                            <Button className="marginTop20 floatLeft" bsStyle="primary">Create</Button>
                        </LinkContainer>
                        <div className="clearfix"></div>
                    </div>
                    <div className="col-lg-12">
                        { this.props.isLoading ?
                        <Spinner />:
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>customer</th>
                                    <th>discount</th>
                                    <th>total</th>
                                    <th width="150px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(invoicesList.length > 0) ? invoicesList.map((invoice, i) =>
                                <tr key={i}>
                                    <td>{i+1}</td>
                                    <td>{customerList[invoice.customer_id]}</td>
                                    <td>{invoice.discount}</td>
                                    <td>{invoice.total}</td>
                                    <td>
                                        <Button className="marginRight10" bsStyle="warning" onClick={this.redirectTo.bind(this, invoice.id)}>Edit</Button>
                                        <Button bsStyle="danger" onClick={this.openModal.bind(this, invoice, 'delete')}>Delete</Button>
                                    </td>
                                </tr>
                                ) :
                                <tr>
                                    <td colSpan="5"><p className="center">List is empty</p></td>
                                </tr>}
                            </tbody>
                        </Table>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ main, invoices }) => {
    const { isLoading } = main;
    const { invoiceCustomerMeta } = invoices;
    return {isLoading, invoiceCustomerMeta, invoices};
};

export default connect(mapStateToProps, InvoicesActions )(Invoices)
