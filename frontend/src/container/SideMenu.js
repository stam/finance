import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Aside, AsideNav, AsideLink, AsideLogo } from 'component/Aside';
import {
    Account,
    AccountDisplay,
    AccountAvatar,
} from 'component/Account';
import View from 'store/View';

@observer
export default class SideMenu extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    handleClickLogout = () => {
        this.props.store.performLogout();
    };

    // Workaround because mobx's @observer kills react-router updates.
    shouldComponentUpdate() {
        return true;
    }

    renderNavigation() {
        if (!this.props.store.isAuthenticated) return null;

        return (
            <AsideNav>
                <AsideLink activeClassName="selected" exact to="/">
                    Dashboard
                </AsideLink>
                <AsideLink activeClassName="selected" to="/tagging">
                    Tagging
                </AsideLink>
                <AsideLink activeClassName="selected" to="/import">
                    Import
                </AsideLink>
            </AsideNav>
        );
    }

    render() {
        return (
            <Aside>
                <AsideLogo>Finance</AsideLogo>
                {this.renderNavigation()}
            </Aside>
        );
    }
}
