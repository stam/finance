import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore } from '../../store/Category';
import { Col, Body } from 're-cy-cle';

@observer
export default class CategoryLevel extends Component {
    static propTypes = {
        store: PropTypes.instanceOf(CategoryStore).isRequired,
    };

    renderItem = c => {
        return <p key={c.cid}>{c.name}</p>;
    };

    render() {
        return (
            <Body>
                <Col>{this.props.store.map(this.renderItem)}</Col>
            </Body>
        );
    }
}
