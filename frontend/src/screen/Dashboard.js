import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { AggregateStore } from '../store/Aggregate';
import { Balance } from '../store/Balance';
import { Row } from 're-cy-cle';
import styled from 'styled-components';
import MonthlySpending from '../container/Dashboard/MonthlySpending';
import BalanceView from '../container/Dashboard/Balance';
import moment from 'moment';
import View from '../store/View';

const Background = styled.div`
    padding: 40px;
`;

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
        this.balance = new Balance();
    }

    componentDidMount() {
        this.balance.fetchLatest();
        this.fetchData();
    }

    @action
    handleDateChange = newDate => {
        this.date = newDate;
        this.fetchData();
    };

    fetchData() {
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
        this.balance.fetchChart({
            start_date: startDate,
            end_date: endDate,
        });
    }

    render() {
        return (
            <Background>
                <BalanceView model={this.balance} />
                <MonthlySpending
                    date={this.date}
                    chartData={this.balance.chart}
                    aggregateStore={this.aggregateStore}
                    changeDate={this.handleDateChange}
                />
            </Background>
        );
    }
}
