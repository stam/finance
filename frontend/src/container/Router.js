import PropTypes from 'prop-types';
import React, { Component } from 'react';
import View from '../store/View';
import { Route, Switch } from 'react-router-dom';

import Dashboard from '../screen/Dashboard';
import Import from '../screen/Import';
import Tagging from '../screen/Tagging';
import Transaction from '../screen/Transaction';
import Category from '../screen/Category';
import NotFound from '../component/NotFound';

export default class Router extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
    };

    // react-router is a bit too verbose so I made a shorthand
    route = Screen => {
        return rProps =>
            <Screen {...rProps} {...this.props} viewStore={this.props.store} />;
    };

    render() {
        return (
            <Switch>
                <Route exact path="/" render={this.route(Dashboard)} />
                <Route exact path="/tagging" render={this.route(Tagging)} />
                <Route
                    exact
                    path="/transactions"
                    render={this.route(Transaction)}
                />
                <Route exact path="/categories" render={this.route(Category)} />
                <Route exact path="/import" render={this.route(Import)} />
                <Route render={this.route(NotFound)} />
            </Switch>
        );
    }
}
