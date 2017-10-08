import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Category } from '../../store/Category';
import styled from 'styled-components';

const Tag = styled.p`
    text-transform: lowercase;
    padding: 6px;
    display: inline-block;
    margin: 4px 0;
    border-radius: 4px;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    background-color: ${props => props.color};
`;

@observer
export default class CategoryItem extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(Category).isRequired,
        onClick: PropTypes.func.isRequired,
    };

    handleClick = () => {
        this.props.onClick(this.props.model);
    };

    render() {
        const m = this.props.model;
        return (
            <div>
                <Tag onClick={this.handleClick} color={m.color}>{m.name}</Tag>
            </div>
        );
    }
}
