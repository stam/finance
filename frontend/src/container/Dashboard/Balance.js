import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Balance } from '../../store/Balance';
import { Col, Heading, Text } from 're-cy-cle';
import styled from 'styled-components';

const ImportantText = styled(Text)`
    font-size: 3em;
    margin: 0;
`;

@observer
export default class BalanceContainer extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Balance).isRequired,
    };

    render() {
        return (
            <Col xs={6} md={3}>
                <Heading>{t('dashboard.balance')}</Heading>
                <ImportantText>
                    <span>&euro;</span>
                    {this.props.model.displayAmount}
                </ImportantText>
            </Col>
        );
    }
}
