import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col } from 'react-bootstrap';

import * as  InvoicesActions from '../actions/invoices';

export class InvoiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            elementId: false,
            invoice: {}
        };
        this.deleteInvoice = this.deleteInvoice.bind(this);
        this.deleteInvoiceElement = this.deleteInvoiceElement.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.invoiceModal && (nextProps.invoiceModal.showModal !== this.props.invoiceModal.showModal)) {
            let { showModal, elementId, invoice } = nextProps.invoiceModal;
            this.setState({showModal, elementId});
            if(invoice && invoice.id) {
                this.setState({invoice});
            } else {
                this.setState({invoice: {}});
            }
        }
    }

    deleteInvoice() {
        this.props.deleteInvoice(this.state.invoice);
    }

    deleteInvoiceElement() {
        this.props.deleteInvoiceElement(this.state.invoice.id, this.state.elementId);
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
                    <p className="center">Are you sure, you want to delete invoice?</p>
                </Modal.Body>
                <Modal.Footer>
                    {this.state.elementId ?
                        <Button bsStyle="danger" onClick={this.deleteInvoiceElement}>Confirm</Button>:
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