import styled from 'styled-components';

export default styled.button`
    background: url(${props => props.icon});
    border: 0;
    padding: 0;
    cursor: pointer;

    ${props => props.big ? `
        height: 48px;
        width: 48px;
    ` : `
        height: 32px;
        width: 32px;
        background-position: center;
        background-size: 50%;
        background-repeat: no-repeat;
    `}
`;
