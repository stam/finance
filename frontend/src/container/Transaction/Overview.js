import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Item from './Item';
import { TransactionStore } from '../../store/Transaction';
import { DateHeader } from '../../component/Transaction/List';
import { map } from 'lodash';
import moment from 'moment';

@observer
export default class TransactionOverview extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(TransactionStore).isRequired,
    };

    renderItem = (i) => {
        return (
            <Item
                key={i.cid}
                model={i}
            />
        );
    };

    renderGroup = (entries, date) => {
        const day = moment(date);
        const dayTitle = day.calendar(null, {
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
