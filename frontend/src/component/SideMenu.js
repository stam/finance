import styled from 'styled-components';
import { COLOR_TINT } from '../styles';

export const Aside = styled.aside`
    right: 0;
    display: flex;
    align-items: flex-start;
`;

export const Toggle = styled.button`
    padding: 4px;
    background: white;
    margin: 8px;
    position: absolute;
    right: 0;
    border-radius: 6px;
    color: ${COLOR_TINT};
    border: 1px solid ${COLOR_TINT};
    text-align: center;

    > p {
        margin: 0;
        transition: all 0.3s ease-out;
        transform: ${props => (props.open ? 'rotate(0deg)' : 'rotate(180deg)')};
    }
`;

export const Menu = styled.div`
    width: 256px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${COLOR_TINT};
`;
