import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Loader } from 're-cy-cle';
import { Store } from '../store/Base';

@observer
export default class OverviewContainer extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(Store).isRequired,
        Item: PropTypes.func.isRequired,
        itemProps: PropTypes.object,
    };

    renderItem = model => {
        return (
            <this.props.Item
                key={model.cid}
                model={model}
                {...this.props.itemProps}
            />
        );
    };

    render() {
        if (this.props.store.isLoading) {
            return <Loader show />;
        }
        if (!this.props.store.length) {
            return <div>No queries found.</div>;
        }
        return (
            <div>
                {this.props.store.map(this.renderItem)}
            </div>
        );
    }
}
