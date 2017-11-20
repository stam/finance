import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from '../../store/Query';
import QueryEdit from './QueryEdit';
import styled from 'styled-components';

const Item = styled.div`
    border-bottom: 1px solid black;
    display: flex;
    cursor: pointer;
    flex-direction: column;
    transition: transform 0.2s ease-out;

    &:hover {
    };
`;

@observer
export default class QueryOverviewItem extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Query).isRequired,
        activeCid: PropTypes.string,
        onClick: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        applyFilter: PropTypes.func.isRequired,
    };

    handleClick = () => {
        this.props.onClick(this.props.model.cid);
    };

    handleFilter = () => {
        this.props.applyFilter(this.props.model.matcher);
    };

    render() {
        const { model, activeCid, onSave } = this.props;
        const active = model.cid === activeCid;
        return (
            <Item onClick={this.handleClick}>
                <p>{model.name || 'New query'}</p>
                {active &&
                    <QueryEdit
                        model={model}
                        applyFilter={this.handleFilter}
                        onSave={onSave}
                    />}
            </Item>
        );
    }
}
