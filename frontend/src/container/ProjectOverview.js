import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ProjectOverviewItem from './ProjectOverviewItem';
import { EntryList } from '../component/EntryList';
import { ProjectStore } from '../store/Project';

@observer
export default class ProjectOverview extends Component {
    static propTypes = {
        projects: PropTypes.instanceOf(ProjectStore).isRequired,
    };

    renderProject(project) {
        return <ProjectOverviewItem key={project.cid} project={project} />;
    }

    render() {
        if (!this.props.projects.length) {
            return <div>You do not have any projects yet.</div>;
        }
        return (
            <EntryList>
                {this.props.projects.map(this.renderProject)}
            </EntryList>
        );
    }
}
