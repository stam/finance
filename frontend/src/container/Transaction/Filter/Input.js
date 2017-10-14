import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button, Col, Form } from 're-cy-cle';
import FilterColumn from './Column';
import FilterOperator from './Operator';
import FilterValue from './Value';
import { DateHeader as Header } from '../../../component/Transaction/List';

@observer
export default class FilterInput extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
    };

    @observable column = null;
    @observable operator = null;
    @observable value = null;

    handleChangeFilter = (key, val) => {
        this[key] = val;
    };

    submitFilter = () => {
        let value = this.value;
        if (this.column === 'amount') {
            value = parseInt(value * 100);
        }
        this.props.applyFilter(`.${this.column}:${this.operator}`, value);
    };

    render() {
        return (
            <Form onSubmit={this.submitFilter}>
                <Col>
                    <Header>New filter</Header>
                    <FilterColumn onChange={this.handleChangeFilter} />
                    <FilterOperator onChange={this.handleChangeFilter} />
                    <FilterValue
                        value={this.value}
                        onChange={this.handleChangeFilter}
                    />
                    <Button type="submit">
                        Apply filter
                    </Button>
                </Col>
            </Form>
        );
    }
}
