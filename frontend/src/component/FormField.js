import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import styled from 'styled-components';

const StyledField = styled.div`
    display: flex;
    flex-flow: column wrap;
`;

const StyledLabel = styled.label`
    margin-bottom: 5px;
    font-size: 14px;
`;

@observer
export default class FormField extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        className: PropTypes.string,
    };

    renderLabel() {
        if (!this.props.label) return null

        return <StyledLabel>{this.props.label}</StyledLabel>;
    }

    render() {
        return (
            <StyledField className={this.props.className}>
                {this.renderLabel()}
                {this.props.children}
            </StyledField>
        );
    }
}
