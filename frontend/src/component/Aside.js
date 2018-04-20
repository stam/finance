import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Aside = styled.aside`
    display: flex;
    justify-content: space-between;
    border-right: 1px solid #ddd;
    background: white;
    flex-direction: column;
    align-items: stretch;
    padding: 24px;
`;

export const AsideNav = styled.nav`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 24px 0;
`;

export const AsideLink = styled(NavLink)`
    display: inline-flex;
    align-items: center;
    padding: 8px 0;
    margin: 4px 0;
    text-decoration: none;
    color: #666;
    text-underline-position: under;
    text-decoration-skip: ink;

    > svg {
        margin-right: 24px;
        color: #ddd;
        width: 24px;
        height: 24px;
    }

    &:hover {
        text-decoration: underline;
    }

    &.selected {
        color: black;
        text-decoration: underline;
    }
`;

export const AsideLogo = styled.div`
    font-size: 24px;
    text-align: center;
    font-weight: bold;
`;
