import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { AggregateStore } from '../store/Aggregate';
import { Heading, Row, Col } from 're-cy-cle';
import moment from 'moment';
import View from '../store/View';
import Content from '../component/Content';

@observer
export default class DashboardScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    @observable now = null;

    componentWillMount() {
        this.now = moment();
        // Create store for aggregates
        // Get current month
        this.aggregateStore = new AggregateStore({
            relations: ['category'],
        });
    }

    componentDidMount() {
        // this.aggregateStore.fetch();
    }

    render() {
        return (
            <Content>
                <Heading>Dashboard</Heading>
                <div>{this.now.format('MMMM')}</div>
            </Content>
        );
    }
}
