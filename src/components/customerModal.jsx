import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Form, FormGroup, FormControl, ControlLabel, HelpBlock, Col } from 'react-bootstrap';

import * as  CustomersActions from '../actions/customers';

export class CustomerModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            action: 'create',
            customer: {
                id: null,
                name: '',
                address: '',
                phone: ''
            },
            validation: {
                nameIsPristine: true,
                addressIsPristine: true,
                phoneIsPristine: true
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.customerModal && (nextProps.customerModal.showModal !== this.props.customerModal.showModal)) {
            let { showModal, action, customer } = nextProps.customerModal;
            this.setState({showModal, action});
            if(customer && customer.id) {
                this.setState({customer});
            } else {
                this.setState({customer: {id: null, name: '', address: '', phone: ''}});
            }
        }
    }

    handleChange(event) {
        let { customer, validation } = this.state;
        customer[event.target.name] = event.target.value;
        validation[event.target.name + 'IsPristine'] = false;
        this.setState({customer});
    }

    saveChanges() {
        if(this.state.customer && this.state.customer.id) {
            this.props.editCustomer(this.state.customer);
        } else {
            this.props.createCustomer(this.state.customer);
        }
        this.resetValidation();
    }

    deleteProduct() {
        this.props.deleteCustomer(this.state.customer);
    }

    closeModal() {
        this.props.closeCustomerModal();
        this.resetValidation();
    }

    resetValidation() {
        let { validation } = this.state;
        validation.nameIsPristine = true;
        validation.addressIsPristine = true;
        validation.phoneIsPristine = true;
        this.setState({validation});
    }

    render() {
        return (
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.action == 'delete' ? 'Delete ' : this.state.customer.id ? 'Edit ' : 'Create '}Customer</Modal.Title>
                </Modal.Header>

                {this.state.action !== 'delete' ?
                    <Form horizontal>
                        <Modal.Body>
                            <FormGroup validationState={this.state.validation.nameIsPristine ? null : (this.state.customer.name.length > 0 ? 'success' : 'error')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Name*
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={this.state.customer.name}
                                        onChange={this.handleChange}/>
                                    {(this.state.validation.nameIsPristine || this.state.customer.name) ? null : <HelpBlock>This field is required</HelpBlock>}
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={this.state.validation.addressIsPristine ? null : (this.state.customer.address.length > 0 ? 'success' : 'error')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Address*
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={this.state.customer.address}
                                        onChange={this.handleChange}/>
                                    {(this.state.validation.addressIsPristine || this.state.customer.address) ? null : <HelpBlock>This field is required</HelpBlock>}
                                </Col>
                            </FormGroup>

                            <FormGroup validationState={this.state.validation.phoneIsPristine ? null : (this.state.customer.phone.length > 0 ? 'success' : 'error')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Phone*
                                </Col>
                                <Col sm={10}>
                                    <FormControl
                                        type="text"
                                        name="phone"
                                        placeholder="Phone"
                                        value={this.state.customer.phone}
                                        onChange={this.handleChange}/>
                                    {(this.state.validation.phoneIsPristine || this.state.customer.phone) ? null : <HelpBlock>This field is required</HelpBlock>}
                                </Col>
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="success"
                                    onClick={this.saveChanges}
                                    disabled={!(this.state.customer.name && this.state.customer.address && this.state.customer.phone)}>{this.state.customer && this.state.customer.id ? 'Save' : 'Create'}</Button>
                            <Button onClick={this.closeModal}>Cancel</Button>
                        </Modal.Footer>
                    </Form> :
                    <div>
                        <Modal.Body>
                            <p className="center">Are you sure, you want to delete product?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button bsStyle="danger" onClick={this.deleteProduct}>Confirm</Button>
                            <Button onClick={this.closeModal}>Cancel</Button>
                        </Modal.Footer>
                    </div>}
            </Modal>
        )
    }
}


const mapStateToProps = (state) => {
    const { customers } = state;

    return customers;
};

export default connect(mapStateToProps, CustomersActions )(CustomerModal)
