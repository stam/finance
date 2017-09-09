import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {
    EntryItem,
    EntryItemProject,
    EntryItemActions,
} from '../component/EntryList';
import Icon from '../component/Icon';
import IconDelete from 'image/icon-delete.svg';
import IconEdit from 'image/icon-edit.svg';
import { Project } from '../store/Project';
import ProjectName from '../component/Project/Name';

@observer
export default class ProjectOverviewItem extends Component {
    static propTypes = {
        project: PropTypes.instanceOf(Project).isRequired,
    };

    @observable editing = false;

    stopEditing = () => {
        this.editing = false;
        this.props.project.save();
    };

    startEditing = () => {
        this.editing = true;
    };

    toggleEditing = () => {
        if (this.editing) {
            this.stopEditing();
        } else {
            this.startEditing();
        }
    };

    handleDelete = () => {
        const sure = window.confirm(
            'Are you completely sure you want to remove this project? All time entries will also be deleted.'
        );
        if (sure) {
            this.props.project.delete();
        }
    };

    render() {
        const { project } = this.props;
        return (
            <EntryItem>
                <EntryItemProject>
                    <ProjectName
                        project={project}
                        editing={this.editing}
                        onClose={this.stopEditing}
                    />
                </EntryItemProject>
                <EntryItemActions>
                    <Icon onClick={this.toggleEditing} icon={IconEdit} />
                    <Icon onClick={this.handleDelete} icon={IconDelete} />
                </EntryItemActions>
            </EntryItem>
        );
    }
}
