import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap';
import Select from 'react-select';

import * as  InvoicesActions from '../actions/invoices';


export class InvoiceEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            mode: 'create',
            invoiceIsSaving: false,
            productList: {},
            productListOption: [],
            customerListOption: [],
            invoice: {
                id: null,
                discount: 0,
                customer_id: null,
                total: 0
            },
            invoiceItems: [],
            currentCustomer: null,
            currentProduct: null,
            isBlankTouched: false
        };
        this.customerChange = this.customerChange.bind(this);
        this.productChange = this.productChange.bind(this);
        this.discountChange = this.discountChange.bind(this);
        this.addItem = this.addItem.bind(this);
        this.changeQty = this.changeQty.bind(this);
        this.saveInvoice = this.saveInvoice.bind(this);
    }

    componentDidMount() {
        document.title = 'Invoice';
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
        if(nextProps.invoiceProductMeta && (nextProps.invoiceProductMeta.length != this.state.productList.length)) {
             let loadedProductList = nextProps.invoiceProductMeta;
             let productListOption = [];
             let productList = {};
            loadedProductList.map((product) => {
                productListOption.push({value: product.id, label: product.name});
                productList[product.id] = {
                    name: product.name,
                    price: product.price
                };
             });
            this.setState({productList, productListOption});
        }
        if(nextProps.invoiceCustomerMeta && (nextProps.invoiceCustomerMeta.length != this.state.productList.length)) {
            let customerList = nextProps.invoiceCustomerMeta;
            let customerListOption = [];
            customerList.map((customer) => {
                customerListOption.push({value: customer.id, label: customer.name});
            });
            this.setState({customerListOption});
        }
        if(this.state.mode == 'edit') {
            if(nextProps.invoice && nextProps.invoice.id && (nextProps.invoice.id != this.state.invoice.id)) {
                this.setState({invoice: nextProps.invoice}, () => {
                    this.state.customerListOption.map((customer, i) => {
                        if(customer.value == this.state.invoice.customer_id) {
                            this.setState({currentCustomer: customer});
                        }
                    });
                    this.props.getInvoiceItems(this.state.invoice.id);
                });
            }
            if(nextProps.invoiceItems) {
                this.setState({invoiceItems: nextProps.invoiceItems}, () => {
                    this.calculateTotal();
                });
            }
        }
    }

    calculateTotal() {
        let { invoice, invoiceItems, productList } = this.state;
        let total = 0;
        let discount = parseFloat(invoice.discount);

        invoiceItems.map((item, i) => {
            if(!item.isDeleted) {
                total += parseFloat(productList[item.product_id].price)*parseInt(item.quantity);
            }
        });
        invoice.total = Math.ceil(total*(100 - discount))/100;
        this.setState({invoice})
    }

    discountChange(event) {
        let { invoice } = this.state;
        invoice[event.target.name] = (event.target.value > 100) ? 100 : (event.target.value < 0) ? 0 : event.target.value;
        this.setState({invoice, isBlankTouched:true}, () => {
            this.calculateTotal();
        });
    }

    customerChange(val) {
        let { invoice } = this.state;
        invoice.customer_id = val && val.value || null;
        this.setState({currentCustomer: val, invoice, isBlankTouched:true});
    }

    productChange(val) {
        this.setState({currentProduct: val});
    }

    addItem() {
        let { invoice, invoiceItems, currentProduct } = this.state;
        let isItemExist = false;

        invoiceItems.map((item, i) => {
            if(!item.isDeleted && item.product_id == currentProduct.value) {
                isItemExist = true;
            }
        });
        if(isItemExist) return;

        invoiceItems.push({
            id: null,
            invoice_id: invoice.id,
            product_id: currentProduct.value,
            quantity: 1
        });
        this.setState({invoiceItems, isBlankTouched: true}, () => {
            this.calculateTotal();
        });
    }

    deleteItem(itemId) {
        let { invoice, invoiceItems } = this.state;
        this.props.openInvoiceModal(invoice, itemId, invoiceItems);
        this.setState({isBlankTouched: true});
    }

    changeQty(event) {
        let el = event.target;
        let { invoiceItems } = this.state;

        if(!(parseFloat(el.value)>0)) {
            el.value = 1;
        }
        let key = el.id.replace('key_', '');
        invoiceItems[key].quantity = el.value;
        if(this.state.mode == 'edit' && (invoiceItems[key].id != null)) {
            invoiceItems[key].isEdited = true;
        }
        this.setState({invoiceItems, isBlankTouched: true}, () => {
            this.calculateTotal();
        });
    }

    saveInvoice() {
        let {invoice, invoiceItems} = this.state;
        if(this.state.mode == 'create') {
            this.props.createInvoice(invoice, invoiceItems).then((result) => {
                if (result.status === 200) {
                    this.props.history.push(`/invoices`);
                }
            });
        } else if(this.state.mode == 'edit') {
            this.props.editInvoice(invoice, invoiceItems)
            .then((result) => {
                if (result.status === 200) {
                    this.props.history.push(`/invoices`);
                }
            });
        }
    }

    render() {
        const { invoice, invoiceItems, productList } = this.state;

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
                                        options={this.state.customerListOption}
                                        isLoading={!this.state.customerListOption.length}
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
                                    options={this.state.productListOption}
                                    isLoading={!this.state.productListOption.length}
                                    onChange={this.productChange}
                                    />
                            </FormGroup>
                         </Col>
                         <Col  sm={3}>
                            <Button className="marginTop20 floatLeft"
                                    bsStyle="primary"
                                    onClick={this.addItem}
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
                                {invoiceItems.length ? invoiceItems.map((item, i) => {
                                    if(!item.isDeleted) {
                                        return <tr key={i}>
                                                    <td>{productList[item.product_id].name}</td>
                                                    <td>{productList[item.product_id].price}</td>
                                                    <td>
                                                        <FormControl
                                                            type="number"
                                                            id={'key_' + i}
                                                            placeholder="Quantity"
                                                            value={item.quantity}
                                                            onChange={this.changeQty}/>
                                                    </td>
                                                    <td>
                                                        <Button bsStyle="danger" onClick={this.deleteItem.bind(this, item.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                    }
                                }

                                ) : null}
                                </tbody>
                            </Table>
                         </Col>

                         <Col sm={12}></Col>

                         <Col sm={12}><h2>Total: {invoice.total}</h2></Col>

                         <Col sm={3}>
                            <Button className="marginTop20 floatLeft"
                                    bsStyle="success"
                                    onClick={this.saveInvoice}
                                    disabled={!this.state.invoice.customer_id || !this.state.isBlankTouched && (this.state.mode == 'edit')}>Save</Button>
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
