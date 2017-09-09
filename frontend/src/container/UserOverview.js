import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import UserOverviewItem from './UserOverviewItem';
import { EntryList } from '../component/EntryList';
import { UserStore } from '../store/User';
import { EntryStore } from '../store/Entry';
import { ProjectStore } from '../store/Project';

@observer
export default class UserOverview extends Component {
    static propTypes = {
        users: PropTypes.instanceOf(UserStore).isRequired,
        entries: PropTypes.instanceOf(EntryStore).isRequired,
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    renderUser = user => {
        const { entries, projects } = this.props;

        const userEntries = entries.filter(entry => {
            return entry.user === user.id && !entry.endedAt;
        });

        return (
            <UserOverviewItem
                key={user.id}
                user={user}
                entries={userEntries}
                projects={projects}
            />
        );
    };

    render() {
        return (
            <EntryList>
                {this.props.users.map(this.renderUser)}
            </EntryList>
        );
    }
}
