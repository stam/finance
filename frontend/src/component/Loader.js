import styled, { keyframes } from 'styled-components';

const sweep = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

export default styled.div`
    width: 16px;
    height: 16px;
    animation: ${sweep} 1s infinite linear;
    border-radius: 8px;
    border-bottom: 2px solid #333;
`;
