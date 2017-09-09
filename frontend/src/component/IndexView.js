import styled, { css } from 'styled-components';
import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

const StyledIndexView = styled.div`
    position: absolute;
    right: 16px;
    pointer-events: all;
    background: white;
    width: 250px;
    padding: 8px;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled(Button)`
    position: absolute;
    right: 0;
    background: none;
    color: black;
    font-size: 2em;
    margin-top: -12px;
    padding: 0 8px;
`;

export const IndexView = ({ onClose, children }) =>
    <StyledIndexView>
        <CloseButton onClick={onClose}>×</CloseButton>
        {children}
    </StyledIndexView>;

IndexView.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func,
};

IndexView.defaultProps = {
    onClose: () => {},
};

export const Row = styled.div`
    border-bottom: 1px solid #CCC;
    padding: 8px;

    &:last-child {
        border-bottom: none;
    }
`;

export const ButtonRow = styled(Row)`
    display: flex;
    justify-content: space-between;
`;

export const Label = styled.p`
    font-size: 0.8em;
    color: #333;
`;

export const Text = styled.p`
    margin: 0;
`;
