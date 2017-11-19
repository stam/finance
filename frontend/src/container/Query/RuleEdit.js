import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Col } from 're-cy-cle';
import { Rule } from '../../store/Query';
import FilterColumn from './Filter/Column';
import FilterOperator from './Filter/Operator';
import FilterValue from './Filter/Value';

@observer
export default class RuleEdit extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
        rule: PropTypes.instanceOf(Rule).isRequired,
    };

    handleChangeFilter = (key, val) => {
        this.props.rule[key] = val;
    };

    submitFilter = e => {
        e.preventDefault();
        this.props.applyFilter();
    };

    render() {
        return (
            <form onSubmit={this.submitFilter}>
                <Col>
                    <FilterColumn onChange={this.handleChangeFilter} />
                    <FilterOperator onChange={this.handleChangeFilter} />
                    <FilterValue
                        value={this.props.rule.value}
                        onChange={this.handleChangeFilter}
                    />
                    <Button type="submit">
                        Apply filter
                    </Button>
                </Col>
            </form>
        );
    }
}
