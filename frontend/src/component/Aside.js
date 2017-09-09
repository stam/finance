import styled from 'styled-components';
import { COLOR_TINT } from '../styles';
import { NavLink } from 'react-router-dom';

export const Aside = styled.div`
    width: 128px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    border-right: 1px solid #EEE;
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
    color: ${COLOR_TINT};

    &.selected {
        text-decoration: underline;
    }
`;

export const AsideLogo = styled.div`
    font-size: 24px;
    display: inline-flex;
    align-items: center;
`;
