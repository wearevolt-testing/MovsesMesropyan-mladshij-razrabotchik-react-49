import React from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'react-bootstrap';

import * as  ProductsActions from '../actions/products';
import Spinner from './../components/spinner';

export class Products extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Product List';
        this.props.getProductList();
    }

    openModal(product, action) {
        let clonedProduct = Object.assign({}, product);
        this.props.openProductModal(clonedProduct, action);
    }

    render(){
        const { productsList } = this.props.products;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="marginRight10 floatLeft">Product List</h1>
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
                                <th>Price</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {(productsList.length > 0) ? productsList.map((product, i) =>
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td width="150px">
                                    <Button className="marginRight10" bsStyle="warning" onClick={this.openModal.bind(this, product, 'edit')}>Edit</Button>
                                    <Button bsStyle="danger" onClick={this.openModal.bind(this, product, 'delete')}>Delete</Button>
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

const mapStateToProps = ({ main, products }) => {
    const { isLoading } = main;

    return {isLoading, products};
};

export default connect(mapStateToProps, ProductsActions )(Products)
