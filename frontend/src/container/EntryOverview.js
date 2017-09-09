import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import moment from 'moment';
import SimpleDuration from 'component/SimpleDuration';
import EntryOverviewItem from './EntryOverviewItem';
import { EntryList, EntryDay, EntryHeading } from '../component/EntryList';
import { ProjectStore } from '../store/Project';
import { EntryStore } from '../store/Entry';
import { UserStore } from '../store/User';

@observer
export default class EntryOverview extends Component {
    static propTypes = {
        entries: PropTypes.instanceOf(EntryStore).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        userStore: PropTypes.instanceOf(UserStore),
        allowEdit: PropTypes.bool,
    };

    renderEntry = entry => {
        return (
            <EntryOverviewItem
                key={entry.cid}
                entry={entry}
                projectStore={this.props.projectStore}
                userStore={this.props.userStore}
                allowEdit={this.props.allowEdit}
            />
        );
    };

    renderDay = (entries, date) => {
        const day = moment(date);
        const dayTitle = day.calendar(null, {
            sameDay: '[Today]',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'dddd DD MMM',
        });
        return (
            <EntryDay key={date}>
                <EntryHeading>
                    <h3>{dayTitle}</h3>
                    <h3>
                        <SimpleDuration
                            minutes={EntryStore.calculateTotalMinutes(entries)}
                        />
                    </h3>
                </EntryHeading>
                <EntryList>
                    {entries.map(this.renderEntry)}
                </EntryList>
            </EntryDay>
        );
    };

    render() {
        if (!this.props.entries.length) {
            return <div>You do not have any entries yet.</div>;
        }
        return (
            <div>
                {map(this.props.entries.groupByDate, this.renderDay)}
            </div>
        );
    }
}
