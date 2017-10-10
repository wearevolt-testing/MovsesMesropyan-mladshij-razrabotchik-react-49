import React from 'react';
import { Image } from 'react-bootstrap';
import spinner from './../static/images/spinner.gif';

const spinnerStyle = {
    display: "block",
    margin: "20px auto 0"
};

const Spinner = () => (
    <div className="col-lg-12">
        <Image style={spinnerStyle} className="center" src={spinner} />
    </div>
);

export default Spinner;
