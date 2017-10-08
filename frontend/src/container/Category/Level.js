import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore } from '../../store/Category';
import Item from '../../component/Category/Item';
import { Col, Body } from 're-cy-cle';

@observer
export default class CategoryLevel extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CategoryStore).isRequired,
        onItemClick: PropTypes.func.isRequired,
    };

    renderItem = c => {
        return <Item key={c.cid} onClick={this.props.onItemClick} model={c} />;
    };

    render() {
        return (
            <Body>
                <Col>{this.props.store.map(this.renderItem)}</Col>
            </Body>
        );
    }
}
