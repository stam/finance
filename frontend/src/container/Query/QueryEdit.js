import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Col, Row, FormField, TextInput } from 're-cy-cle';
import { Query } from '../../store/Query';
import FilterColumn from './Filter/Column';
import FilterOperator from './Filter/Operator';
import FilterValue from './Filter/Value';

@observer
export default class RuleEdit extends Component {
    static propTypes = {
        onSave: PropTypes.func.isRequired,
        applyFilter: PropTypes.func.isRequired,
        model: PropTypes.instanceOf(Query).isRequired,
    };

    handleChangeRule = (key, val) => {
        this.props.model.matcher.rules[0][key] = val;
    };

    handleChange = (key, val) => {
        this.props.model[key] = val;
    };

    handleSave = e => {
        console.log('handleSave');
        e.preventDefault();
        this.props.onSave(this.props.model);
    };

    handleClick = e => {
        e.stopPropagation();
    };

    render() {
        const { model, applyFilter } = this.props;
        const rule = model.matcher.rules[0];
        return (
            <form onSubmit={this.handleSave} onClick={this.handleClick}>
                <Col>
                    {model.id === null &&
                        <FormField label="Name">
                            <TextInput
                                name="name"
                                onChange={this.handleChange}
                                value={this.props.model.name}
                            />
                        </FormField>}
                    <FilterColumn
                        value={rule.column}
                        onChange={this.handleChangeRule}
                    />
                    <FilterOperator
                        value={rule.operator}
                        onChange={this.handleChangeRule}
                    />
                    <FilterValue
                        value={rule.value}
                        onChange={this.handleChangeRule}
                    />
                    <Col>
                        <Row>
                            {model.id === null &&
                                <Button
                                    disabled={!rule.isValid}
                                    onClick={applyFilter}
                                    type="button"
                                >
                                    Run query
                                </Button>}
                            <Button type="submit">
                                Save
                            </Button>
                        </Row>
                    </Col>
                </Col>
            </form>
        );
    }
}
