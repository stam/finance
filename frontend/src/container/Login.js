import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Button from '../component/Button';
import CenterContainer from '../component/Container/Center';
import View from '../store/View';

const {
    CY_FRONTEND_OAUTH_URL,
    CY_FRONTEND_OAUTH_CLIENT_ID,
} = process.env;

@observer
export default class Login extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View),
    };

    handleClick() {
        const redirectUri = encodeURIComponent(`${window.location.origin}/`);
        const scopes = ['profile', 'email', 'openid'].join('%20')
        const location = `${CY_FRONTEND_OAUTH_URL}?response_type=code&client_id=${CY_FRONTEND_OAUTH_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scopes}`;
        window.location = location;
    }

    render() {
        if (!this.props.viewStore.online) {
            return (
                <CenterContainer>
                    There is no connection to the backend. Do you have an active internet connection?
                </CenterContainer>
            );
        }
        return (
            <CenterContainer>
                <Button onClick={this.handleClick}>
                    Login with Google
                </Button>
            </CenterContainer>
        );
    }
}
