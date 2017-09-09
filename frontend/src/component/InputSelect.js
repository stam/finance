import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, PropTypes as MobxTypes } from 'mobx-react';
import Select from 'react-select';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
    .Select-control {
        height: ${props => (props.small ? '35' : '48')}px;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
    }

    .Select-input {
        height: ${props => (props.small ? '35' : '48')}px;
    }

    .Select-input > input {
        line-height: ${props => (props.small ? '14' : '28')}px;
    }

    .Select-placeholder,
    .Select-control .Select-value {
        line-height: ${props => (props.small ? '35' : '48')}px!important;
    }

    .Select-value-label {
        color: #000 !important;
    }

    .Select-menu-outer {
        left: 0;
        right: 0;
        border: 0;
        border-top: 1px solid #ddd;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    .Select-option:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;

@observer
export default class InputSelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        name: PropTypes.string.isRequired,
        options: MobxTypes.arrayOrObservableArray.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string,
        autoFocus: PropTypes.bool,
        onBlur: PropTypes.func,
        small: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
    };

    handleChange = option => {
        this.props.onChange(this.props.name, option ? option.value : '');
    };

    renderOption(option) {
        return (
            <option value={option.value} key={option.value}>
                {option.name}
            </option>
        );
    }

    render() {
        return (
            <StyledSelect
                value={this.props.value}
                options={this.props.options}
                onChange={this.handleChange}
                placeholder={this.props.placeholder}
                autofocus={this.props.autoFocus}
                onBlur={this.props.onBlur}
                small={this.props.small}
            />
        );
    }
}
