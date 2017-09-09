import styled, { css } from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export const LinkContainer = styled.div`
    padding: 16px;
`;

export const TopMenuNav = styled.nav`
    flex: 1;
    display: flex;
    align-items: stretch;
    margin: 0 16px;
`;

const linkStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: all;

    color: black;
    background: white;
    text-decoration: none;

    padding: 8px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.3);
`;

export const Link = styled(NavLink)`
    ${linkStyle}
`;

const Back = styled.a`
    ${linkStyle}
    cursor: pointer;
`;

export const BackButton = ({ history }) =>
    <Back
        onClick={() => {
            history.push('/');
        }}
    >
        Back
    </Back>;

BackButton.propTypes = {
    history: PropTypes.object.isRequired,
};

export const TopMenuLogo = styled.div`
    font-size: 32px;
    display: inline-flex;
    align-items: center;
`;
