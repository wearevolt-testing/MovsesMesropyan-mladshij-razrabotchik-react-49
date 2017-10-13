import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

import * as  MainActions from '../actions/main';

export class GlobalAlert extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.alert && nextProps.alert.showAlert) {
            setTimeout(this.handleAlertDismiss, 2000);
        }
    }

    handleAlertDismiss() {
        this.props.closeAlert();
    }

    render() {
        const { alert } = this.props;

        return (
            <div>
                {alert.showAlert ?
                <div className="alertWrapper">
                    <Alert bsStyle={alert.type} onDismiss={this.handleAlertDismiss}>
                        <h4>{alert.title}</h4>
                        <p>{alert.body}</p>
                    </Alert>
                </div> : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state.main;
};

export default connect(mapStateToProps, MainActions )(GlobalAlert)
