import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Button, Col } from 're-cy-cle';
import FilterColumn from './Column';
import FilterOperator from './Operator';
import FilterValue from './Value';
import { DateHeader as Header } from '../../../component/Transaction/List';

@observer
export default class FilterInput extends Component {
    static propTypes = {
        // store: PropTypes.instanceOf(View).isRequired,
    };

    @observable column = null;
    @observable operator = null;
    @observable value = null;

    handleChangeFilter = (key, val) => {
        this[key] = val;
    };

    applyFilter = () => {
        console.log('TODO apply filter');
    };

    render() {
        return (
            <Col>
                <Header>New filter</Header>
                <FilterColumn onChange={this.handleChangeFilter} />
                <FilterOperator onChange={this.handleChangeFilter} />
                <FilterValue
                    value={this.value}
                    onChange={this.handleChangeFilter}
                />
                <Button onClick={this.applyFilter}>
                    Apply filter
                </Button>
            </Col>
        );
    }
}
