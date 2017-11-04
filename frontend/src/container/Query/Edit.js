import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, InlineText, Col, FormField, TextInput } from 're-cy-cle';
import CategorySelect from '../Category/Select';
import { Query } from '../../store/Query';

@observer
export default class QueryEdit extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Query).isRequired,
        onSave: PropTypes.func.isRequired,
    };

    handleSubmit = e => {
        e.preventDefault();

        // If current collection contains transactions with queries
        // Block... show merge conflict view
        //
        // If current collection contains transactions with categories
        // Allow override
        this.props.model.save().then(() => {
            this.props.model.clear();
            // Show success notification
            this.props.onSave();
        });
    };

    handleChange = (key, value) => {
        this.props.model[key] = value;
    };

    handleCategorySelect = (key, id) => {
        this.props.model.category.id = id;
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Col>
                    <FormField label="Category">
                        <CategorySelect
                            onChange={this.handleCategorySelect}
                            value={this.props.model.category.id}
                        />
                    </FormField>
                    <FormField label="Name">
                        <TextInput
                            name="name"
                            onChange={this.handleChange}
                            value={this.props.model.name}
                        />
                    </FormField>
                    <FormField label="Filter">
                        <InlineText>
                            {this.props.model.matcher.toLabel()}
                        </InlineText>
                    </FormField>
                    <Button type="submit">
                        Create query
                    </Button>
                </Col>
            </form>
        );
    }
}
