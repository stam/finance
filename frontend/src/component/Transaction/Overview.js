import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Item from './Item';
import { DataImportStore } from '../../store/DataImport';

@observer
export default class ImportOverview extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(DataImportStore).isRequired,
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
        if (!this.props.store.length) {
            return <div>You do not have any transactions yet.</div>;
        }
        return (
            <div>
                {this.props.store.map(this.renderImport)}
            </div>
        );
    }
}
