import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { TextInput, FormField } from 're-cy-cle';

@observer
export default class FilterValue extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    @observable value = null;

    handleValueChange = (name, val) => {
        this.props.onChange('value', val);
    };

    render() {
        return (
            <FormField label="Value">
                <TextInput
                    value={this.props.value}
                    onChange={this.handleValueChange}
                />
            </FormField>
        );
    }
}
