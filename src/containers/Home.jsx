import React from 'react';

export default class Home extends React.Component{
    constructor(props) {
        super(props);
    }

    componentDidMount () {
        document.title = 'Home Component';
    }

    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <h1>Home Component</h1>
                    </div>
                </div>
            </div>
        )
    }
}