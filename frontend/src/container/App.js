import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import NotificationArea from '../component/NotificationArea';
import Login from './Login';
import Nav from './Nav';
import AppContainer from '../component/AppContainer';
import ContentContainer from '../component/ContentContainer';
import NetworkInfo from '../component/NetworkInfo';
import View from '../store/View';
import Router from './Router';
import Menu from './Menu';
import { BrowserRouter } from 'react-router-dom';

@observer
export default class App extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    render() {
        const { store } = this.props;
        let content = null;
        if (store.isAuthenticated) {
            content = <Router store={store} />;
        } else {
            content = <Login viewStore={store} />;
        }

        return (
            <BrowserRouter>
                <AppContainer>
                    <Nav store={store} />
                    <NotificationArea store={store} />
                    <ContentContainer>
                        {content}
                    </ContentContainer>
                    <Menu store={store} />
                    <NetworkInfo store={store} />
                </AppContainer>
            </BrowserRouter>
        );
    }
}
