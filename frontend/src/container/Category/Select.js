import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore } from '../../store/Category';
import { FancySelect } from 're-cy-cle';

@observer
export default class CategorySelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.number,
    };

    componentWillMount() {
        this.categoryStore = new CategoryStore({
            limit: 1000,
        });
    }

    componentDidMount() {
        this.categoryStore.fetch();
    }

    formatCategoryOption(c) {
        return {
            value: c.id,
            label: c.name,
        };
    }

    render() {
        return (
            <FancySelect
                name="category"
                onChange={this.props.onChange}
                options={this.categoryStore.map(this.formatCategoryOption)}
                value={this.props.value}
            />
        );
    }
}
