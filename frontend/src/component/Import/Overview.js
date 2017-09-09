import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImportStore } from '../../store/DataImport';

@observer
export default class ImportOverview extends Component {
    static propTypes = {
        imports: PropTypes.instanceOf(DataImportStore).isRequired,
    };

    renderImport = (i) => {
        return (
            <div>
                <p>Import {i.id}</p>
            </div>
        );
    };

    render() {
        if (!this.props.imports.length) {
            return <div>You do not have any imports yet.</div>;
        }
        return (
            <div>
                {this.props.imports.map(this.renderImport)}
            </div>
        );
    }
}
