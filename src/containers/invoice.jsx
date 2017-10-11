import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';

import * as  InvoicesActions from '../actions/invoices';


export class InvoiceEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,//
            mode: 'create',
            elementIsSaving: false,
            invoiceIsSaving: false,
            productList: [],
            customerList: [],
            invoice: {
                id: null,
                discount: 0,
                customer_id: null,
                total: 0
            },
            invoiceElements: {},
            currentCustomer: null,
            currentProduct: null
        };
        this.customerChange = this.customerChange.bind(this);
        this.productChange = this.productChange.bind(this);
        this.discountChange = this.discountChange.bind(this);
        this.addElement = this.addElement.bind(this);
        this.changeQty = this.changeQty.bind(this);
        this.saveInvoice = this.saveInvoice.bind(this);
    }

    componentDidMount() {
        this.props.getInvoiceProductMeta();
        this.props.getInvoiceCustomerMeta();
        let url = this.props.location.pathname;

        if(/^(\/invoices\/[a-z0-9]+\/edit)$/.test(url)) {
            this.setState({mode: 'edit'});
            let invoiceId = url.split('/')[2];
            this.props.getInvoice(invoiceId);
        } else {
            this.props.history.push(`/invoices/create`);
        }
    }

    componentWillReceiveProps (nextProps) {
        let promises = [];

        if(nextProps.invoiceProductMeta && (nextProps.invoiceProductMeta.length != this.state.productList.length)) {
             let productList = nextProps.invoiceProductMeta;
             let processedProductList = [];
             productList.map((product) => {
                processedProductList.push({value: product.id, label: product.name, price: product.price});
             });
            this.setState({productList: processedProductList}, () => {
                promises.push(processedProductList);
            })
        }
        if(nextProps.invoiceCustomerMeta && (nextProps.invoiceCustomerMeta.length != this.state.productList.length)) {
            let customerList = nextProps.invoiceCustomerMeta;
            let processedCustomerList = [];
            customerList.map((customer) => {
                processedCustomerList.push({value: customer.id, label: customer.name});
            });
            this.setState({customerList: processedCustomerList})
        }
        if(this.state.mode == 'edit') {
            if(nextProps.invoice && nextProps.invoice.id && (nextProps.invoice.id != this.state.invoice.id)) {
                this.setState({invoice: nextProps.invoice}, () => {
                    this.state.customerList.map((customer, i) => {
                        if(customer.value == this.state.invoice.customer_id) {
                            this.setState({currentCustomer: customer});
                        }
                    });
                    this.props.getInvoiceElements(this.state.invoice.id);
                });
            }
            if(nextProps.invoiceElements && nextProps.invoiceElements.length) {
                Promise.all(promises)
                    .then((result) => {
                        let loadedInvoiceElements = nextProps.invoiceElements;
                        let invoiceElements = {};
                        let productList = {};
                        this.state.productList.map((product, i) => {
                            productList[product.value] = product;
                        });
                        loadedInvoiceElements.map((element, i) => {
                            invoiceElements[element.id] = {
                                name: productList[element.product_id].label,
                                product_id: productList[element.product_id].value,
                                price: productList[element.product_id].price,
                                quantity: element.quantity
                            };
                        });
                        this.setState({invoiceElements}, () => {
                            //console.log(this.state.invoiceElements, this.state.productList);
                        });
                    });

            }
        }

    }

    discountChange(event) {
        let invoice = this.state.invoice;
        invoice[event.target.name] = (event.target.value > 100) ? 100 : (event.target.value < 0) ? 0 : event.target.value;
        this.setState({invoice});
    }

    customerChange(val) {
        let invoice = this.state.invoice;
        invoice.customer_id = val && val.value || null;
        this.setState({currentCustomer: val, invoice}, () => {
            //console.log(this.state);
        });
    }

    productChange(val) {
        this.setState({currentProduct: val}, () => {
            //console.log(this.state.currentProduct);
        });
    }

    addElement() {
        let { invoice, invoiceElements, currentProduct } = this.state;
        if(invoiceElements[currentProduct.value]) return;
        invoiceElements[currentProduct.value] = {
            name: currentProduct.label,
            product_id: currentProduct.value,
            price: currentProduct.price,
            quantity: 1
        };
        this.setState({invoiceElements}, () => {
            if(this.state.mode == 'edit') {
                let elementToSend = {
                    invoice_id: invoice.id,
                    product_id: currentProduct.value,
                    quantity: 1
                };
                this.setState({elementIsSaving: true});
                this.props.createInvoiceElement(invoice.id, elementToSend).then((response) => {
                    if (response.status === 200 && response.data) {
                        this.setState({elementIsSaving: false});
                    }
                });
            }
        });
    }

    deleteElement(elementId) {
        let { invoice } = this.state;
        this.props.openInvoiceModal(invoice, elementId);
    }

    changeQty(event) {
        let el = event.target;
        let { invoiceElements } = this.state;
        invoiceElements[el.name].quantity = el.value;
        this.setState({invoiceElements});
    }

    saveInvoice() {
        let {invoice, invoiceElements} = this.state;
        if(this.state.mode == 'create') {
            this.props.createInvoice(invoice, invoiceElements).then((result) => {
                if (result.status === 200) {
                    this.props.history.push(`/invoices`);
                }
            });
        } else if(this.state.mode == 'edit') {
            this.props.editInvoice(invoice).then((result) => {
                if (result.status === 200) {
                    this.props.history.push(`/invoices`);
                }
            });
        }
    }

    render() {
        const { invoiceElements } = this.state;
        const invoiceElementsKeys = Object.keys(invoiceElements);

        return (
            <div className="container">
                <div className="row">
                    <h1 className="col-lg-12">Create invoice</h1>
                     <Form horizontal>
                         <Col sm={4}>
                                <FormGroup>
                                    <ControlLabel>Discount (%)</ControlLabel>
                                    <FormControl
                                        type="number"
                                        name="discount"
                                        placeholder="Discount"
                                        min="0"
                                        value={this.state.invoice.discount}
                                        onChange={this.discountChange}/>
                                </FormGroup>
                         </Col>

                         <Col sm={12}></Col>

                         <Col sm={5}>
                                <FormGroup validationState={this.state.invoice.customer_id ? (this.state.invoice.customer_id > 0 ? 'success' : 'error') : null}>
                                    <ControlLabel>Customer</ControlLabel>
                                    <Select
                                        name="form-field-name"
                                        value={this.state.currentCustomer}
                                        options={this.state.customerList}
                                        isLoading={!this.state.customerList.length}
                                        onChange={this.customerChange}
                                        />
                                </FormGroup>
                         </Col>

                         <Col sm={12}></Col>

                         <Col sm={4}>
                            <FormGroup>
                                <ControlLabel>Add Product</ControlLabel>
                                <Select
                                    name="form-field-name"
                                    value={this.state.currentProduct}
                                    options={this.state.productList}
                                    isLoading={!this.state.productList.length}
                                    onChange={this.productChange}
                                    />
                            </FormGroup>
                         </Col>
                         <Col  sm={3}>
                            <Button className="marginTop20 floatLeft"
                                    bsStyle="primary"
                                    onClick={this.addElement}
                                    disabled={!this.state.currentProduct}>Add</Button>
                         </Col>

                         <Col sm={12}></Col>

                         <Col sm={12}>
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th width="80"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {invoiceElementsKeys ? invoiceElementsKeys.map((elementId, i) =>
                                        <tr key={i}>
                                            <td>{invoiceElements[elementId].name}</td>
                                            <td>{invoiceElements[elementId].price}</td>
                                            <td>
                                                <FormControl
                                                    type="number"
                                                    name={elementId}
                                                    placeholder="Quantity"
                                                    value={invoiceElements[elementId].quantity}
                                                    onChange={this.changeQty}/>
                                            </td>
                                            <td>
                                                <Button bsStyle="danger" onClick={this.deleteElement.bind(this, elementId)}>Delete</Button>
                                                {this.state.elementIsSaving ? <span>L</span> : null}
                                            </td>
                                        </tr>
                                ) : null}
                                </tbody>
                            </Table>
                         </Col>

                         <Col sm={3}>
                            <Button className="marginTop20 floatLeft"
                                    bsStyle="success"
                                    onClick={this.saveInvoice}
                                    disabled={!this.state.invoice.customer_id}>Save</Button>
                         </Col>

                         <Col sm={12}></Col>
                    </Form>
                </div>
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    const {invoices} = state;

    return invoices;
};

export default connect(mapStateToProps, InvoicesActions )(InvoiceEdit)
