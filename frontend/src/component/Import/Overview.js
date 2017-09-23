import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DataImportStore } from '../../store/DataImport';
import Item from './Item';

@observer
export default class ImportOverview extends Component {
    static propTypes = {
        imports: PropTypes.instanceOf(DataImportStore).isRequired,
    };

    renderImport = (i) => {
        return (
            <Item
                key={i.cid}
                model={i}
            />
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
