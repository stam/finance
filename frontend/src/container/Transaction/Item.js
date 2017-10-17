import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Transaction } from '../../store/Transaction';
import { COLOR_EXTRA_LIGHT, COLOR_LIGHT } from '../../styles';
import styled from 'styled-components';
import { Col, Row } from 're-cy-cle';

const StyledRow = styled(Row)`
    padding: 0 5px;

    p {
        margin: 0;
    }
`;

const Container = styled(Col)`
    border-bottom: 1px solid ${COLOR_LIGHT};
    padding-top: 16px;
    padding-bottom: 16px;
    cursor: pointer;

    &:last-child {
        border-bottom-width: 0;
    }
    transition: background-color 0.3s ease-out;


    &:hover {
        background-color: ${COLOR_EXTRA_LIGHT};
    }
`;

const TextGrow = styled.p`
    flex: 1;
`;

const TextFixed = styled.p`
    width: ${props => props.width}px;
`;

@observer
export default class ImportItem extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Transaction).isRequired,
        onToggle: PropTypes.func.isRequired,
        activeCid: PropTypes.string,
    };

    handleToggle = () => {
        this.props.onToggle(this.props.model.cid);
    };

    render() {
        const { model, activeCid } = this.props;
        const active = model.cid === activeCid;
        return (
            <Container onClick={this.handleToggle}>
                <StyledRow>
                    <TextGrow>{model.summary}</TextGrow>
                    <TextFixed width="13">{model.operator}</TextFixed>
                    <TextFixed width="60">{model.amount}</TextFixed>
                </StyledRow>
                {active &&
                    <StyledRow>
                        <TextGrow>{model.details}</TextGrow>
                    </StyledRow>}
            </Container>
        );
    }
}
