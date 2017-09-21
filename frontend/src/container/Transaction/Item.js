import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImport } from '../../store/DataImport';
import styled from 'styled-components';

const Row = styled.div`
    padding: 0 5px;
    border-bottom: 1px solid #ddd;
    display: flex;

    &:last-child {
        border-bottom-width: 0;
    }
`;

const TextGrow = styled.p`
    flex: 1;
`

const TextFixed = styled.p`
    width: ${props => props.width}px;
`;

@observer
export default class ImportItem extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(DataImport).isRequired,
    };

    render() {
        const m = this.props.model;
        return (
            <Row>
                <TextGrow>{m.description}</TextGrow>
                <TextFixed width="13">{m.operator}</TextFixed>
                <TextFixed width="60">{m.amount}</TextFixed>
            </Row>
        );
    }
}
