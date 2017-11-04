import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { AggregateStore } from '../store/Aggregate';
import { Heading, Row, Col } from 're-cy-cle';
import moment from 'moment';
import View from '../store/View';
import Tag from '../component/Category/Item';
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
        this.aggregateStore = new AggregateStore();
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        const startDate = this.now
            .clone()
            .startOf('month')
            .format('YYYY-MM-DD');
        const endDate = this.now.clone().endOf('month').format('YYYY-MM-DD');
        this.aggregateStore.fetch({
            data: {
                start_date: startDate,
                end_date: endDate,
            },
        });
    }

    renderItem = a => {
        return (
            <Row key={a.id}>
                <Col xs>
                    <Tag model={a} />
                </Col>
                <Col xs>{a.sumAmount || 0}</Col>
            </Row>
        );
    };

    render() {
        return (
            <Content>
                <Heading>Dashboard</Heading>
                <div>{this.now.format('MMMM')}</div>
                <Row>
                    <Col xs>Category</Col>
                    <Col xs>Amount</Col>
                </Row>
                {this.aggregateStore.map(this.renderItem)}
            </Content>
        );
    }
}
