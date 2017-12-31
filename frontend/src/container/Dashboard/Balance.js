import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Col, Button, Heading } from 're-cy-cle';
import moment from 'moment';

@observer
export default class Balance extends Component {
    static propTypes = {
        // date: PropTypes.instanceOf(moment).isRequired,
        // onChange: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Col xs={1}>
                <Heading>Balance</Heading>
                <p>12 euro</p>
            </Col>
        );
    }
}
