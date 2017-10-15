import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Col, FormField } from 're-cy-cle';
import { Query } from '../../store/Query';

@observer
export default class QueryEdit extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Query).isRequired,
    };

    handleSubmit = () => {
        console.log('TODO create query');
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Col>
                    <FormField label="Category">
                        <p>CategorySelect</p>
                    </FormField>
                    <FormField label="Name">
                        <p>Name</p>
                    </FormField>
                    <FormField label="Filter">
                        <p>Matcher view</p>
                    </FormField>
                    <Button type="submit">
                        Create query
                    </Button>
                </Col>
            </form>
        );
    }
}
