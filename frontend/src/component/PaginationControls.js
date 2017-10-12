import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 're-cy-cle';
import { Store } from 'mobx-spine';

@observer
export default class PaginationControls extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(Store).isRequired,
    };

    handlePrevious = () => {
        this.props.store.getPreviousPage();
    };

    handleNext = () => {
        this.props.store.getNextPage();
    };

    render() {
        const store = this.props.store;
        return (
            <div>
                <Button
                    onClick={this.handlePrevious}
                    disabled={!store.hasPreviousPage}
                >
                    Previous
                </Button>
                {store.currentPage}/{store.totalPages}
                <Button onClick={this.handleNext} disabled={!store.hasNextPage}>
                    Next
                </Button>
            </div>
        );
    }
}
