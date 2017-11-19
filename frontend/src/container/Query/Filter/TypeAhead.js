import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { TypeAhead as RCTypeAhead } from 're-cy-cle';
import { filter } from 'lodash';

@observer
export default class TypeAhead extends Component {
    static propTypes = {
        options: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired,
    };

    @computed
    get options() {
        return filter(this.props.options, opt => {
            return opt.label.toLowerCase().includes(this.search.toLowerCase());
        });
    }

    @observable search = '';

    handleChange = (name, val) => {
        this.search = val;
    };

    render() {
        return (
            <RCTypeAhead
                onChange={this.handleChange}
                onSelect={this.props.onSelect}
                options={this.options}
            />
        );
    }
}
