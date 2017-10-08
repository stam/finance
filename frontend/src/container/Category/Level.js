import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore, Category } from '../../store/Category';
import Button from '../../component/Button';
import { Col, Body } from 're-cy-cle';

@observer
export default class CategoryLevel extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CategoryStore).isRequired,
    };

    renderItem = c => {
        return <p key={c.cid}>{c.name}</p>;
    };

    addCategory = () => {
        const c = new Category({
            name: 'Groceries',
            color: '#27b148',
        });
        c.save().then(() => {
            this.props.store.add(c.toJS());
        });
    };

    render() {
        return (
            <Body>
                <Button onClick={this.addCategory}>Add</Button>
                <Col>{this.props.store.map(this.renderItem)}</Col>
            </Body>
        );
    }
}
