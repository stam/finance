import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import 'moment-duration-format';
import App from './container/App';
import ViewStore from './store/View';
import { BrowserRouter } from 'react-router-dom';
import { ReCyCleTheme } from 're-cy-cle';
import { theme } from './styles';
import { t } from './i18n';

console.log('t', t);
window.t = t;
const viewStore = new ViewStore();

ReactDOM.render(
    <ReCyCleTheme theme={theme}>
        <BrowserRouter>
            <App store={viewStore} />
        </BrowserRouter>
    </ReCyCleTheme>,
    document.getElementById('root')
);
