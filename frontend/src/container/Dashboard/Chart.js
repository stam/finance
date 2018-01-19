import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { extent as d3ArrayExtent } from 'd3-array';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from 'd3-axis';
import {
    scaleLinear as d3ScaleLinear,
    scaleTime as d3ScaleTime,
} from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';

const WIDTH = 800;
const HEIGHT = 300;

@observer
export default class DashboardChart extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: MobxPropTypes.observableArray,
    };

    render() {
        if (!this.props.data.length) {
            return <svg width={WIDTH} height={HEIGHT} />;
        }
        const data = toJS(this.props.data);
        const xScale = d3ScaleTime()
            .domain(
                d3ArrayExtent(data, d => {
                    return new Date(d[0]);
                })
            )
            .range([0, WIDTH]);
        const yScale = d3ScaleLinear()
            .domain(d3ArrayExtent(data, d => d[1]))
            .range([HEIGHT, 0]);

        const xAxis = d3AxisBottom()
            .scale(xScale)
            .ticks(data.length / 6);
        const yAxis = d3AxisLeft()
            .scale(yScale)
            .ticks(5);

        return (
            <svg width={WIDTH} height={HEIGHT}>
                <g
                    className="xAxis"
                    ref={node => d3Select(node).call(xAxis)}
                    style={{
                        transform: `translateY(${HEIGHT}px)`,
                    }}
                />
                <g className="yAxis" ref={node => d3Select(node).call(yAxis)} />
            </svg>
        );
    }
}
