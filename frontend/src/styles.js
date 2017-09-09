import { injectGlobal, css } from 'styled-components';
import 'react-select/dist/react-select.css';

export const COLOR_TINT = '#2E43D7';

const MOBILE_QUERY = '(max-width: 768px)';

export function mobile(...args) {
    return css`
        @media ${MOBILE_QUERY} {
            ${css(...args)}
        }
    `;
}

export default injectGlobal`
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        color: #333;
        font-family: -apple-system, system-ui, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    textarea,
    input,
    button {
        outline: none;
        font-family: inherit;
    }
    html, body, #root {
        width: 100%;
        height: 100%;
    }
`;
