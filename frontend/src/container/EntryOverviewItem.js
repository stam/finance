import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import {
    EntryItem,
    EntryItemTime,
    EntryItemActions,
} from 'component/EntryList';
import SimpleDuration from 'component/SimpleDuration';
import Icon from 'component/Icon';
import { ProjectStore } from 'store/Project';
import { UserStore } from 'store/User';
import { Entry } from 'store/Entry';
import IconDelete from 'image/icon-delete.svg';
import EntryDescription from 'component/Entry/Description';
import EntryProject from 'component/Entry/Project';

@observer
export default class EntryOverviewItem extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        userStore: PropTypes.instanceOf(UserStore),
        allowEdit: PropTypes.bool,
    };

    handleDelete = () => {
        this.props.entry.delete();
    };

    render() {
        const { entry, allowEdit, projectStore } = this.props;
        const diffMinutes = entry.differenceInMinutes;

        let userColumn = null;
        if (this.props.userStore) {
            const user = entry.user
                ? this.props.userStore.get(entry.user)
                : null;
            userColumn = <EntryItemTime>{user.displayName}</EntryItemTime>;
        }
        return (
            <EntryItem>
                <EntryProject
                    entry={entry}
                    projectStore={projectStore}
                    allowEdit={allowEdit}
                />
                <EntryDescription entry={entry} allowEdit={allowEdit} />
                <EntryItemTime>{entry.startedAt.format('H:mm')}</EntryItemTime>
                <div>—</div>
                <EntryItemTime>
                    {entry.endedAt ? entry.endedAt.format('H:mm') : 'Running'}
                </EntryItemTime>
                <EntryItemTime>
                    <SimpleDuration minutes={diffMinutes} />
                </EntryItemTime>
                {userColumn}
                <EntryItemActions>
                    {allowEdit
                        ? <Icon onClick={this.handleDelete} icon={IconDelete} />
                        : null}
                </EntryItemActions>
            </EntryItem>
        );
    }
}
