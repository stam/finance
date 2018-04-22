import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

@observer
export default class DashboardChart extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        data: MobxPropTypes.observableArray,
    };

    render() {
        const dataWithTuples = toJS(this.props.data);
        const data = dataWithTuples.map(tick => {
            const name = tick[0];
            const balance = tick[1] / 100;
            return { name, balance };
        });

        return (
            <AreaChart
                width={800}
                height={300}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.2}
                        />
                        <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" minTickGap={20} />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#8884d8"
                    fillOpacity={1}
                    strokeWidth={5}
                    unit="€"
                    fill="url(#colorUv)"
                />
            </AreaChart>
        );
    }
}
