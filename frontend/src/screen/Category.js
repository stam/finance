import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { CategoryStore, Category } from '../store/Category';
import CategoryEdit from '../container/Category/Edit';
import View from '../store/View';
import Level from '../container/Category/Level';
import { Body, Heading, Row } from 're-cy-cle';
import RowSeperated from '../component/RowSeperated';

@observer
export default class CategoryScreen extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        const id = this.props.match.params.id;
        console.log('match.params', this.props.match.param);

        this.categoryStore = new CategoryStore();
        this.category = new Category({ id: id ? parseInt(id) : null });
    }

    componentDidMount() {
        this.categoryStore.fetch();
    }

    handleCreate = c => {
        this.categoryStore.add(c.toJS());
        c.clear();
    };

    render() {
        return (
            <Body>
                <Heading>Categories</Heading>
                <Row style={{ flex: 1 }}>
                    <Level height={0} store={this.categoryStore} />
                </Row>
                <RowSeperated>
                    <CategoryEdit
                        onCreate={this.handleCreate}
                        model={this.category}
                    />
                </RowSeperated>
            </Body>
        );
    }
}
