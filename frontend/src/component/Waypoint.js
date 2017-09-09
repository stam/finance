import React, { Component, PropTypes } from 'react';
import { Marker } from 'react-leaflet';
import { Waypoint } from '../store/Waypoint';

export default class WaypointMarker extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Waypoint).isRequired,
    };

    goToMarker = e => {
        const { model } = this.props;
        model.__store.emitter.emit('onMarkerClick', model);
    };

    render() {
        const { model } = this.props;
        return <Marker onClick={this.goToMarker} position={model.position} />;
    }
}
