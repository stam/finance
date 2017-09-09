import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { action } from 'mobx';
import { Map, TileLayer, PolyLine } from 'react-leaflet';
import styled from 'styled-components';
import ContentContainer, { Main } from '../component/ContentContainer';
import { WaypointStore } from '../store/Waypoint';
import { TrailStore } from '../store/Trail';
import WaypointMarker from '../component/Waypoint';
import LeafletTrail from '../component/LeafletTrail';
import View from '../store/View';

@withRouter
@observer
export default class MapView extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(View).isRequired,
        history: PropTypes.object.isRequired,
        children: PropTypes.node,
    };

    @action
    handleMapRef = ref => {
        const map = ref && ref.leafletElement;
        if (!map) {
            return;
        }
        this.leafletElement = map;
    };

    componentWillMount() {
        this.waypointStore = new WaypointStore();
        this.trailStore = new TrailStore();
    }

    renderWaypoint = wp => {
        return <WaypointMarker key={wp.cid} model={wp} />;
    };

    renderTrail = tr => {
        return <LeafletTrail key={tr.cid} model={tr} />;
    };

    render() {
        const position = [51.479692, 5.495396];
        const { children } = this.props;
        const childrenWithMap = React.cloneElement(children, {
            map: this.leafletElement,
            waypointStore: this.waypointStore,
            trailStore: this.trailStore,
        });
        return (
            <Main>
                <ContentContainer>
                    {childrenWithMap}
                </ContentContainer>
                <StyledMap
                    center={position}
                    zoom={15}
                    zoomControl={false}
                    innerRef={this.handleMapRef}
                >
                    {this.trailStore.map(this.renderTrail)}
                    {this.waypointStore.map(this.renderWaypoint)}
                    <TileLayer
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                </StyledMap>
            </Main>
        );
    }
}

const StyledMap = styled(Map)`
    width: 100%;
    flex: 1;

    .leaflet-pane {
        z-index: initial;
    }
`;
