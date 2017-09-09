import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { sortBy } from 'lodash';
import { EntryItemProject } from '../EntryList';
import { Entry } from 'store/Entry';
import { ProjectStore } from 'store/Project';
import InputSelect from '../InputSelect';
import Form from '../Form';

function formatProjectToOption(project) {
    return {
        value: String(project.id),
        label: project.name,
    };
}

@observer
export default class EntryProject extends Component {
    static propTypes = {
        entry: PropTypes.instanceOf(Entry).isRequired,
        projectStore: PropTypes.instanceOf(ProjectStore).isRequired,
        allowEdit: PropTypes.bool,
    };

    @observable editing = false;

    handleBlur = () => {
        this.editing = false;
        this.props.entry.save();
    };

    handleClick = () => {
        if (this.props.allowEdit) {
            this.editing = true;
        }
    };

    handleChange = (name, value) => {
        this.props.entry.project = isNaN(value) ? null : parseInt(value);
    };

    render() {
        const { entry, allowEdit } = this.props;
        const project = entry.project
            ? this.props.projectStore.get(entry.project)
            : null;

        let projectOptions = this.props.projectStore.map(formatProjectToOption);
        projectOptions = sortBy(projectOptions, m => m.label.toLowerCase());

        if (this.editing) {
            return (
                <EntryItemProject>
                    <Form onSubmit={this.handleBlur}>
                        <InputSelect
                            name="project"
                            placeholder="Project"
                            options={projectOptions}
                            onChange={this.handleChange}
                            autoFocus
                            small
                            onBlur={this.handleBlur}
                            value={entry.project ? String(entry.project) : ''}
                        />
                    </Form>
                </EntryItemProject>
            );
        }
        return (
            <EntryItemProject onClick={this.handleClick} allowEdit={allowEdit}>
                {project ? project.name : <i>No project</i>}
            </EntryItemProject>
        );
    }
}
