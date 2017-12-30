import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Category } from '../../store/Category';
import { Aggregate } from '../../store/Aggregate';
import styled from 'styled-components';

const Tag = styled.p`
    text-transform: lowercase;
    padding: 3px;
    display: inline-block;
    margin: 4px 0;
    border-radius: 4px;
    color: black;
    border: 2px solid #ccc;
    font-style: ${props => (props.italic ? 'italic' : 'initial')};
`;

@observer
export default class CategoryItem extends Component {
    static propTypes = {
        model: PropTypes.oneOfType([
            PropTypes.instanceOf(Aggregate),
            PropTypes.instanceOf(Category),
        ]).isRequired,
        onClick: PropTypes.func,
    };

    handleClick = () => {
        if (this.props.onClick) {
            this.props.onClick(this.props.model);
        }
    };

    getColor() {
        return this.props.model.color || '#CCC';
    }

    getName() {
        const name = this.props.model.name;
        if (name) {
            return name;
        }
        return 'Uncategorized';
    }

    render() {
        const m = this.props.model;
        return (
            <div>
                <Tag
                    italic={m.id === null}
                    onClick={this.handleClick}
                    color={this.getColor()}
                >
                    {this.getName()}
                </Tag>
            </div>
        );
    }
}
