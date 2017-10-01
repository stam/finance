import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import 'moment-duration-format';
import App from './container/App';
import ViewStore from './store/View';
import './styles';

const viewStore = new ViewStore();

ReactDOM.render(<App store={viewStore} />, document.getElementById('root'));
