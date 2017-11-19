import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { FormField } from 're-cy-cle';
import TypeAhead from './TypeAhead';

@observer
export default class FilterColumn extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string,
    };

    options = [
        { value: 'summary', label: 'Summary' },
        { value: 'date', label: 'Date' },
        { value: 'details', label: 'Details' },
        { value: 'sourceAccount', label: 'Source account' },
        { value: 'targetAccount', label: 'Target account' },
        { value: 'type', label: 'Type' },
        { value: 'amount', label: 'Amount' },
        { value: 'direction', label: 'Direction' },
    ];

    handleSelect = val => {
        this.props.onChange('column', val);
    };

    render() {
        return (
            <FormField label="Field name">
                <TypeAhead
                    name="column"
                    onSelect={this.handleSelect}
                    options={this.options}
                    value={this.props.value}
                />
            </FormField>
        );
    }
}
