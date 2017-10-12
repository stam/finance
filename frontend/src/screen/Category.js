import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { CategoryStore, Category } from '../store/Category';
import CategoryEdit from '../container/Category/Edit';
import View from '../store/View';
import Level from '../container/Category/Level';
import { Heading, Row, ContentContainer } from 're-cy-cle';
import Button from '../component/Button';
import Content from '../component/Content';
import RowSeperated from '../component/RowSeperated';

@observer
export default class CategoryScreen extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    @observable category = null;

    componentWillMount() {
        this.categoryStore = new CategoryStore();
        this.category = new Category();
    }
    componentDidMount() {
        this.categoryStore.fetch();
    }
    handleCreate = c => {
        this.categoryStore.add(c.toJS());
        c.clear();
    };

    handleItemClick = c => {
        console.log('handleItemClick');
        this.category = c;
    };

    handleAddClick = () => {
        console.log('click add');
    };

    render() {
        return (
            <ContentContainer>
                <Content>
                    <Row middle="xs">
                        <Heading>Categories</Heading>
                        <Button
                            style={{ marginLeft: 10 }}
                            onClick={this.handleAddClick}
                        >
                            Add
                        </Button>
                    </Row>
                    <Row style={{ flex: 1 }}>
                        <Level
                            height={0}
                            onItemClick={this.handleItemClick}
                            store={this.categoryStore}
                        />
                    </Row>
                    <RowSeperated>
                        <CategoryEdit
                            onCreate={this.handleCreate}
                            model={this.category}
                        />
                    </RowSeperated>
                </Content>
            </ContentContainer>
        );
    }
}
