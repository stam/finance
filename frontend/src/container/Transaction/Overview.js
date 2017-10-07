import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Item from './Item';
import { TransactionStore } from '../../store/Transaction';
import { DateHeader } from '../../component/Transaction/List';
import { map } from 'lodash';

@observer
export default class TransactionOverview extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(TransactionStore).isRequired,
    };

    renderItem = i => {
        return <Item key={i.cid} model={i} />;
    };

    // We sort and groupBy the moment internal YYYY-MM-DD representation
    // The given date is also YYYY-MM-DD
    // We want a moment value for the calendar function,
    // so we just use the date of the first model. (It's grouped by date...)
    renderGroup = (entries, dateString) => {
        const date = entries[0].date;
        const dayTitle = date.calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'dddd DD MMM',
        });
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
            return <div>You do not have any transactions yet.</div>;
        }
        return (
            <div>
                {map(this.props.store.groupByDate, this.renderGroup)}
            </div>
        );
    }
}
