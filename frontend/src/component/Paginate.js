import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Store } from 'mobx-spine';
import { COLOR_TINT, COLOR_MEDIUM } from '../styles';
import styled from 'styled-components';

const StyleWrapper = styled.div`
    ul {
        display: flex;
        justify-content: center;
        padding-left: 0;
    }

    li {
        display: flex;
        margin-right: 5px;
    }

    li.selected a {
        background: ${COLOR_TINT};
        border-color: black;
        color: black;

        &:hover {
            background: #ffb1be;
        };
    }

    a:hover {
    }

    a {
        border-radius: 4px;
        border: 2px solid ${COLOR_MEDIUM};
        color: black;
        background: white;
        cursor: pointer;
        padding: 0 10px;
        height: 30px;
        line-height: 27px;

        &:hover {
            background: #f4f4f4;
        }
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
