import { injectGlobal, css } from 'styled-components';

export const COLOR_TINT = '#ffa4b7';
export const COLOR_MEDIUM = '#b4b4b4';
export const COLOR_LIGHT = '#ddd';
export const COLOR_EXTRA_LIGHT = 'rgba(200, 200, 200, 0.1)';

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
