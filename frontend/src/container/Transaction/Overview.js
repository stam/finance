import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import Item from './Item';
import { TransactionStore } from '../../store/Transaction';
import { DateHeader } from '../../component/Transaction/List';
import { Body } from 're-cy-cle';
import { map } from 'lodash';
import moment from 'moment';

@observer
export default class TransactionOverview extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(TransactionStore).isRequired,
        onTransactionClick: PropTypes.func,
    };

    componentWillUpdate() {
        this.currentYear = moment().year();
    }

    renderItem = i => {
        return (
            <Item
                activeCid={this.activeCid}
                onToggle={this.handleToggle}
                key={i.cid}
                model={i}
            />
        );
    };

    handleToggle = transaction => {
        if (this.props.onTransactionClick) {
            this.props.onTransactionClick(transaction);
        }

        if (this.activeCid === transaction.cid) {
            this.activeCid = null;
            return;
        }
        this.activeCid = transaction.cid;
    };

    @observable activeCid = null;

    // We sort and groupBy the moment internal YYYY-MM-DD representation
    // The given date is also YYYY-MM-DD
    // We want a moment value for the calendar function,
    // so we just use the date of the first model. (It's grouped by date...)
    renderGroup = (entries, dateString) => {
        const date = entries[0].date;
        let dayTitle;

        if (date.year() < this.currentYear) {
            dayTitle = date.format('dddd DD MMM YYYY');
        } else {
            dayTitle = date.calendar(null, {
                sameDay: '[Today]',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'dddd DD MMM',
            });
        }

        return (
            <div key={date}>
                <DateHeader>{dayTitle}</DateHeader>
                <div>
                    {entries.map(this.renderItem)}
                </div>
            </div>
        );
    };

    render() {
        if (!this.props.store.length) {
            return <Body>You do not have any transactions yet.</Body>;
        }
        return (
            <Body>
                {map(this.props.store.groupByDate, this.renderGroup)}
            </Body>
        );
    }
}
