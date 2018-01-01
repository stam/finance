import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { AggregateStore } from '../store/Aggregate';
import { Row, Content } from 're-cy-cle';
import MonthlySpending from '../container/Dashboard/MonthlySpending';
import Balance from '../container/Dashboard/Balance';
import moment from 'moment';
import View from '../store/View';

@observer
export default class DashboardScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    @observable date = null;

    componentWillMount() {
        this.date = moment();
        // Create store for aggregates
        // Get current month
        this.aggregateStore = new AggregateStore();
    }

    componentDidMount() {
        this.fetch();
    }

    @action
    handleDateChange = newDate => {
        this.date = newDate;
        this.fetch();
    };

    fetch() {
        const startDate = this.date
            .clone()
            .startOf('month')
            .format('YYYY-MM-DD');
        const endDate = this.date
            .clone()
            .endOf('month')
            .format('YYYY-MM-DD');
        this.aggregateStore.fetch({
            data: {
                start_date: startDate,
                end_date: endDate,
            },
        });
    }

    render() {
        return (
            <Content>
                <Row>
                    <Balance />
                    <MonthlySpending
                        date={this.date}
                        aggregateStore={this.aggregateStore}
                        changeDate={this.handleDateChange}
                    />
                </Row>
            </Content>
        );
    }
}
