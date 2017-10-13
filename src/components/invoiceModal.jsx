import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col } from 'react-bootstrap';

import * as  InvoicesActions from '../actions/invoices';

export class InvoiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            itemId: false,
            invoice: {}
        };
        this.deleteInvoice = this.deleteInvoice.bind(this);
        this.deleteInvoiceItem = this.deleteInvoiceItem.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.invoiceModal && (nextProps.invoiceModal.showModal !== this.props.invoiceModal.showModal)) {
            let { showModal, itemId, invoice, invoiceItems } = nextProps.invoiceModal;
            this.setState({showModal, itemId});
            if(invoice && invoice.id) {
                this.setState({invoice, invoiceItems});
            } else {
                this.setState({invoice: {}, invoiceItems: []});
            }
        }
    }

    deleteInvoice() {
        this.props.deleteInvoice(this.state.invoice);
    }

    deleteInvoiceItem() {
        this.props.deleteInvoiceItem(this.state.invoice.id, this.state.itemId, this.state.invoiceItems);
    }

    closeModal() {
        this.props.closeInvoiceModal();
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="center">Are you sure, you want to delete invoice{this.state.itemId ? ' item' : null}?</p>
                </Modal.Body>
                <Modal.Footer>
                    {this.state.itemId ?
                        <Button bsStyle="danger" onClick={this.deleteInvoiceItem}>Confirm</Button>:
                        <Button bsStyle="danger" onClick={this.deleteInvoice}>Confirm</Button>}

                    <Button onClick={this.closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    const { invoices } = state;

    return invoices;
};

export default connect(mapStateToProps, InvoicesActions )(InvoiceModal)