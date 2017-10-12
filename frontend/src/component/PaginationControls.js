import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 're-cy-cle';
import { Store } from 'mobx-spine';
import { range } from 'lodash';
import { COLOR_TINT } from '../styles';
import styled from 'styled-components';

const MAX_BUTTONS = 9;

const Page = styled(Button)`
    border: 1px solid ${COLOR_TINT};
    background: white;
    color: ${COLOR_TINT};

    ${props =>
        props.disabled &&
        `
        background: ${COLOR_TINT};
        color: white;
        `};
`;

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

    renderPage(page) {
        const store = this.props.store;
        return (
            <Page
                onClick={() => {
                    store.setPage(page);
                }}
                disabled={store.currentPage === page}
                key={page}
            >
                {page}
            </Page>
        );
    }

    renderRange(pageRange) {
        return (
            <div>
                {pageRange.map(page => this.renderPage)}
            </div>
        );
    }

    renderBody() {
        const store = this.props.store;
        if (store.totalPages < MAX_BUTTONS) {
            const pages = range(1, store.totalPages + 1);
            return this.renderRange(pages);
        }
        return this.renderPage(store.currentPage);
    }

    render() {
        const store = this.props.store;
        console.log('currentPage', store.currentPage);
        // Always show 9 buttons
        // If page count < MAX_BUTTON:
        // render button for each page
        return (
            <div>
                <Button
                    onClick={this.handlePrevious}
                    disabled={!store.hasPreviousPage}
                >
                    Previous
                </Button>
                {this.renderBody()}
                <Button onClick={this.handleNext} disabled={!store.hasNextPage}>
                    Next
                </Button>
            </div>
        );
    }
}
