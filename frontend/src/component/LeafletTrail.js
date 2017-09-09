import React, { Component, PropTypes } from 'react';
import { Polyline } from 'react-leaflet';
import { Trail } from '../store/Trail';

export default class LeafletTrail extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Trail).isRequired,
    };

    handleClick = e => {
        const { model } = this.props;

        // L.DomEvent.disableClickPropagation(el);
        // model.__store.emitter.emit('onMarkerClick', model);
    };

    render() {
        const { model } = this.props;
        return (
            <Polyline onClick={this.handleClick} positions={model.positions} />
        );
    }
}
