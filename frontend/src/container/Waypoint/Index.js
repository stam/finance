import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Waypoint } from '../../store/Waypoint';
import Button from '../../component/Button';
import {
    IndexView,
    Row,
    ButtonRow,
    Label,
    Text,
} from '../../component/IndexView';

@observer
export default class WaypointIndex extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Waypoint).isRequired,
        startConnect: PropTypes.func.isRequired,
        stopConnect: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    };

    delete = () => {
        this.props.model.delete();
    };

    @observable connecting = false;

    connect = () => {
        const { startConnect, model } = this.props;
        this.connecting = true;
        startConnect(model);
    };

    connectStop = () => {
        const { stopConnect } = this.props;
        this.connecting = false;
        stopConnect();
    };

    goBack = () => {
        this.props.history.push(`/areas/`);
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props.model && this.connecting) {
            this.connectStop();
        }
    }

    componentWillUnmount() {
        if (this.connecting) {
            this.connectStop();
        }
    }

    render() {
        const { model } = this.props;
        return (
            <IndexView onClose={this.goBack}>
                <Row>
                    <Text>Waypoint {model.id}</Text>
                </Row>
                <Row>
                    <Label>Location</Label>
                    <Text>Blarghstraat 49q</Text>
                </Row>
                <ButtonRow>
                    <Button onClick={this.connect}>Connect</Button>
                    <Button onClick={this.delete}>Delete</Button>
                </ButtonRow>
            </IndexView>
        );
    }
}
