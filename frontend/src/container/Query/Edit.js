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
    };

    handleSubmit = e => {
        e.preventDefault();
        console.log('TODO create query');
    };

    handleChange = (key, value) => {
        this.props.model[key] = value;
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Col>
                    <FormField label="Category">
                        <CategorySelect
                            onChange={this.handleChange}
                            value={this.props.model.category}
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
