import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore } from '../store/Category';
import View from '../store/View';
import Level from '../container/Category/Level';
import { Body, Heading, Row } from 're-cy-cle';

@observer
export default class CategoryScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.categoryStore = new CategoryStore();
    }

    componentDidMount() {
        this.categoryStore.fetch();
    }

    render() {
        return (
            <Body>
                <Heading>Categories</Heading>
                <Row>
                    <Level height={0} store={this.categoryStore} />
                </Row>
            </Body>
        );
    }
}
