import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';
import {
    EntryItem,
    EntryItemProject,
    EntryItemDescription,
} from '../component/EntryList';
import Link from '../component/Link';
import { User } from '../store/User';
import { ProjectStore } from '../store/Project';
import SmartDuration from '../component/SmartDuration';

@observer
export default class UserOverviewItem extends Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
        entries: PropTypes.array.isRequired,
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    renderEntry = entry => {
        const project = this.props.projects.get(entry.project);
        return (
            <span key={entry.id}>
                {project ? project.name : '[unknown project]'}
                {' '}
                since
                {' '}
                {entry.startedAt.format('HH:mm')}
                {' '}
                (
                <SmartDuration startedAt={entry.startedAt} endedAt={moment()} />
                )
            </span>
        );
    };

    renderEntries = entries => {
        if (entries.length > 0) {
            return entries.map(this.renderEntry);
        }
        return 'Not working at the moment';
    };

    render() {
        const { user, entries } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    <Link to={`/user/entries/${user.id}`}>
                        {user.displayName}
                    </Link>
                </EntryItemProject>
                <EntryItemDescription>
                    {this.renderEntries(entries)}
                </EntryItemDescription>
            </EntryItem>
        );
    }
}
