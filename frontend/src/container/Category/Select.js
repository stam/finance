import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CategoryStore } from '../../store/Category';
import { FancySelect } from 're-cy-cle';

@observer
export default class CategorySelect extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.categoryStore = new CategoryStore({
            limit: 1000,
        });
    }

    componentDidMount() {
        this.categoryStore.fetch();
    }

    // We use an int for the internal value,
    // but respond with a model to the parent component
    @observable value = null;
    handleChange = (name, id) => {
        this.props.onChange(this.categoryStore.get(id));
    };
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
                onChange={this.handleChange}
                options={this.categoryStore.map(this.formatCategoryOption)}
                value={this.value}
            />
        );
    }
}
