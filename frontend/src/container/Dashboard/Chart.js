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
        const selectX = d => new Date(d[0]);
        const selectY = d => d[1];

        const yBounds = d3ArrayExtent(data, selectY);
        const xScale = d3ScaleTime()
            .domain(d3ArrayExtent(data, selectX))
            .range([0, WIDTH]);
        const yScale = d3ScaleLinear()
            .domain([yBounds[0] * 0.85, yBounds[1] * 1.05])
            .range([HEIGHT, 0]);

        const xAxis = d3AxisBottom()
            .scale(xScale)
            .ticks(data.length / 6);
        const yAxis = d3AxisLeft()
            .scale(yScale)
            .ticks(5);

        // const selectScaledX = datum => xScale(selectX(datum));
        const selectScaledY = datum => yScale(selectY(datum));

        data.map((d, i) => {
            console.log(i, d[0], d[1], selectY(d));
            return d;
        });

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
                <g className="bars">
                    {data.map((bar, i) => (
                        <rect
                            key={i}
                            width={WIDTH / data.length - 1}
                            height={HEIGHT - selectScaledY(bar)}
                            x={WIDTH / data.length * i}
                            y={selectScaledY(bar)}
                            data-x={bar[0]}
                            data-y={bar[1]}
                        />
                    ))}
                </g>
            </svg>
        );
    }
}
