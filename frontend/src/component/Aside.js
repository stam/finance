import styled from 'styled-components';
import { COLOR_TINT } from '../styles';
import { NavLink } from 'react-router-dom';

export const Aside = styled.aside`
    display: flex;
    justify-content: space-between;
    border-right: 2px solid black;
    background: ${COLOR_TINT};
    /*background: linear-gradient(40deg, #8EDAFF, ${COLOR_TINT});*/
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
`;

export const AsideNav = styled.nav`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 16px 0;
`;

export const AsideLink = styled(NavLink)`
    display: inline-flex;
    align-items: center;
    padding: 8px 0;
    margin: 4px 0;
    text-decoration: none;
    color: black;
    text-underline-position: under;
    text-decoration-skip: ink;

    > svg {
        margin-right: 6px;
    }

    &:hover {
        text-decoration: underline;
    }

    &.selected {
        text-decoration: underline;
    }
`;

export const AsideLogo = styled.div`
    font-size: 24px;
    display: inline-flex;
    color: black;
    align-items: center;
`;
