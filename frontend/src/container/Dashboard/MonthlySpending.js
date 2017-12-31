import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { AggregateStore } from '../../store/Aggregate';
import { Heading, Row, Col } from 're-cy-cle';
import MonthPicker from './MonthPicker';
import moment from 'moment';
import Amount from '../../component/Transaction/Amount';
import Tag from '../../component/Category/Item';

@observer
export default class MonthlySpending extends Component {
    static propTypes = {
        aggregateStore: PropTypes.instanceOf(AggregateStore).isRequired,
        date: PropTypes.instanceOf(moment).isRequired,
        changeDate: PropTypes.func.isRequired,
    };

    handleDateChange = newDate => {
        this.props.changeDate(newDate);
    };

    renderItem = a => {
        return (
            <Row key={a.id}>
                <Col xs>
                    <Tag model={a} />
                </Col>
                <Col xs style={{ alignSelf: 'center' }}>
                    <Amount>{a.displaySumAmount || 0}</Amount>
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <Col xs={3}>
                <Heading>{t('dashboard.monthOverview')}</Heading>
                <MonthPicker
                    date={this.props.date}
                    onChange={this.handleDateChange}
                />
                <Row>
                    <Col>
                        <Row>
                            <Col xs>Category</Col>
                            <Col xs style={{ textAlign: 'right' }}>
                                Amount
                            </Col>
                        </Row>
                        {this.props.aggregateStore.map(this.renderItem)}
                    </Col>
                    <Col />
                </Row>
            </Col>
        );
    }
}
