import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { COLOR_TINT } from '../styles';

const StyledButton = styled.button`
    background: ${COLOR_TINT};
    color: white;
    border: 0;
    height: 36px;
    padding: 0 8px;
    cursor: pointer;

    &:disabled {
        background: #444;
        color: #fff;
        cursor: initial;
    }
`;

const Button = props =>
    <StyledButton type="button" {...props}>
        {props.children}
    </StyledButton>;

Button.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
