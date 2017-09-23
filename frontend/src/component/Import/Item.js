import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImport } from '../../store/DataImport';
import { COLOR_EXTRA_LIGHT, COLOR_LIGHT } from '../../styles';
import styled from 'styled-components';


const Row = styled.div`
    padding: 0 5px;
    border-bottom: 1px solid ${COLOR_LIGHT};
    display: flex;
    transition: background-color 0.3s ease-out;

    &:last-child {
        border-bottom-width: 0;
    }

    &:hover {
        background-color: ${COLOR_EXTRA_LIGHT};
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

    renderImport = (i) => {
        return (
            <div key={i.cid}>
                <p>Import {i.id}</p>
            </div>
        );
    };

    render() {
        const m = this.props.model;
        return (
            <Row>
                <TextFixed width="30">{m.id}</TextFixed>
                <TextGrow>{m.firstTransactionDate.format('DD-MM-YYYY')}</TextGrow>
                <TextGrow>{m.lastTransactionDate.format('DD-MM-YYYY')}</TextGrow>
            </Row>
        );
    }
}