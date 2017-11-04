import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 're-cy-cle';
import moment from 'moment';

@observer
export default class PaginationControls extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(moment).isRequired,
        onChange: PropTypes.func.isRequired,
    };

    handlePrevious = () => {
        const { date, onChange } = this.props;
        onChange(date.clone().subtract(1, 'month'));
    };

    handleNext = () => {
        const { date, onChange } = this.props;
        onChange(date.clone().add(1, 'month'));
    };

    render() {
        const date = this.props.date;
        return (
            <div>
                <Button onClick={this.handlePrevious}>
                    Previous
                </Button>
                {date.format('MMMM')}
                <Button onClick={this.handleNext}>
                    Next
                </Button>
            </div>
        );
    }
}
