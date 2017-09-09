import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

// It's not likely you can work for more than 12 hours.
const UNLIKELY_MINUTES = 720;
const IMPOSSIBLE_MINUTES = 1440;

@observer
export default class SmartDuration extends Component {
    static propTypes = {
        startedAt: PropTypes.instanceOf(moment).isRequired,
        endedAt: PropTypes.instanceOf(moment),
    };

    // Only relevant when endedAt is not given
    @observable timeBetween = null;
    @observable interval = null;

    componentDidMount() {
        this.startOrStopTimer(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.startOrStopTimer(nextProps);
    }

    startOrStopTimer = props => {
        if (props.endedAt) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    };

    startTimer = () => {
        this.stopTimer();
        this.calculateDiff();
        this.interval = setInterval(() => {
            this.calculateDiff();
        }, 5000);
    };

    calculateDiff = () => {
        const now = moment();
        this.timeBetween = now.diff(this.props.startedAt, 'minutes');
    };

    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    componentWillUnmount() {
        this.stopTimer();
    }

    render() {
        const { startedAt, endedAt } = this.props;
        // `endedAt` is set to end of the minute so the duration is exactly 1 hours if start time is e.g. 18:00 and end time 19:00
        let nowDiff = this.timeBetween;
        if (endedAt) {
            nowDiff = endedAt
                .clone()
                .endOf('minute')
                .diff(startedAt, 'minutes');
        }
        const duration = moment.duration(nowDiff, 'minutes');

        let style = {};

        if (nowDiff > IMPOSSIBLE_MINUTES || nowDiff < 0) {
            style = { color: '#ed4949' };
        } else if (nowDiff > UNLIKELY_MINUTES) {
            style = { color: '#eecb3d' };
        }

        return <span style={style}>{duration.format('h[h] m[m]')}</span>;
    }
}
