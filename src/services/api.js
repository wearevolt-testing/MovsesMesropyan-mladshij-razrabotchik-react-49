import React, { Component } from 'react';
import axios from 'axios';

const invoiceAppAPI = {
    /* Customers */
	getCustomerList: () => {
		return axios.get(`/api/customers`);
	},

    createCustomer: (customer) => {
        return axios.post(`/api/customers/`, customer);
    },

    editCustomer: (customer) => {
        return axios.put(`/api/customers/${customer.id}`, customer);
    },

    deleteCustomer: (customer) => {
        return axios.delete(`/api/customers/${customer.id}`);
    },

    /* Products */
    getProductList: () => {
        return axios.get(`/api/products`);
    },

    createProduct: (product) => {
        return axios.post(`/api/products/`, product);
    },

    editProduct: (product) => {
        return axios.put(`/api/products/${product.id}`, product);
    },

    deleteProduct: (product) => {
        return axios.delete(`/api/products/${product.id}`);
    },

    /* Invoices*/
    getInvoiceList: () => {
        return axios.get(`/api/invoices`);
    },

    createInvoice: (invoice) => {
        return axios.post(`/api/invoices`, invoice);
    },

    deleteInvoice: (invoiceId) => {
        return axios.delete(`/api/invoices/${invoiceId}`);
    },

    getInvoiceElements: (invoiceId) => {
        return axios.get(`/api/invoices/${invoiceId}/items/`);
    },

    createInvoiceElements: (invoiceId, invoiceElements) => {
        return axios.post(`/api/invoices/${invoiceId}/items`, invoiceElements);
    },

    deleteInvoiceElement: (invoiceId, elementId) => {
        return axios.delete(`/api/invoices/${invoiceId}/items/${elementId}`);
    }
};

export default invoiceAppAPI
