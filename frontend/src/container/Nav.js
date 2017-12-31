import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Aside, AsideNav, AsideLink, AsideLogo } from 'component/Aside';
import {
    IconAttachment,
    IconLabelOutline,
    IconImportExport,
    IconPieChartOutlined,
    IconShowChart,
} from 're-cy-cle';
import View from 'store/View';

@observer
export default class Nav extends Component {
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
                    <IconShowChart />
                    {t('nav.home')}
                </AsideLink>
                <AsideLink activeClassName="selected" to="/transactions">
                    <IconImportExport />
                    {t('nav.transaction')}
                </AsideLink>
                <AsideLink activeClassName="selected" to="/tagging">
                    <IconLabelOutline />
                    {t('nav.tag')}
                </AsideLink>
                <AsideLink activeClassName="selected" to="/categories">
                    <IconPieChartOutlined />
                    {t('nav.category')}
                </AsideLink>
                <AsideLink activeClassName="selected" to="/import">
                    <IconAttachment />
                    {t('nav.import')}
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
