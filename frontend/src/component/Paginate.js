import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Store } from 'mobx-spine';
import { COLOR_TINT } from '../styles';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    ul {
        display: flex;
    }

    li {
        display: flex;
        margin-right: 5px;
    }

    li.selected a {
        background: ${COLOR_TINT};
        color: white;
    }

    a {
        border-radius: 4px;
        border: 1px solid ${COLOR_TINT};
        color: ${COLOR_TINT};
        background: white;
        cursor: pointer;
        padding: 0 10px;
        height: 30px;
        line-height: 27px;
    }
`;

@observer
export default class PaginationControls extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(Store).isRequired,
    };

    handlePageChange = page => {
        this.props.store.setPage(page.selected + 1);
    };

    render() {
        const store = this.props.store;
        return (
            <StyleWrapper>
                <ReactPaginate
                    pageCount={store.totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    forcePage={store.currentPage - 1}
                    onPageChange={this.handlePageChange}
                />
            </StyleWrapper>
        );
    }
}
