import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Query } from '../../store/Query';
import RuleEdit from './RuleEdit';
import styled from 'styled-components';

const Item = styled.div`
    border-bottom: 1px solid black;
    display: flex;
    flex-direction: column;

    &:hover {
        background: rgba(0, 0, 0, 0.3);
    };

    &:last-child {
        border-bottom-width: 0;
    };
`;

@observer
export default class QueryOverviewItem extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Query).isRequired,
        onClick: PropTypes.func.isRequired,
        activeCid: PropTypes.string,
    };

    handleClick = () => {
        this.props.onClick(this.props.model.cid);
    };

    render() {
        const { model, activeCid } = this.props;
        const active = model.cid === activeCid;
        return (
            <Item onClick={this.handleClick}>
                <p>{model.name}</p>
                {active &&
                    <RuleEdit
                        rule={model.matcher.rules[0]}
                        applyFilter={() => {}}
                    />}
            </Item>
        );
    }
}
