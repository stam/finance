import { injectGlobal, css } from 'styled-components';

export const COLOR_TINT = '#2E43D7';
export const COLOR_MEDIUM = '#5783E8';
export const COLOR_LIGHT = '#AFE3FF';
export const COLOR_EXTRA_LIGHT = '#E9F7FF';

const MOBILE_QUERY = '(max-width: 768px)';

export function mobile(...args) {
    return css`
        @media ${MOBILE_QUERY} {
            ${css(...args)}
        }
    `;
}

export const theme = {
    primaryColor: COLOR_TINT,
};

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
