import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Menu } from '../component/SideMenu';
import { FormField, RadioButtons, Button } from 're-cy-cle';
import CategorySelect from './Category/Select';
import { Query, QueryStore } from '../store/Query';
import Overview from './Overview';
import QueryOverviewItem from './Query/OverviewItem';

@observer
export default class TaggingMenu extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
        onQuerySave: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.query = new Query(
            {},
            {
                relations: ['category'],
            }
        );
        this.queryStore = new QueryStore();
    }

    handleFilter = () => {
        this.props.applyFilter(this.query.matcher.toStoreParams());
    };

    @observable categoryId = null;
    handleCategorySelect = (key, id) => {
        if (id === '') {
            this.categoryId = null;
            this.queryStore.clear();
            return;
        }
        this.categoryId = id;
        this.queryStore.params = {
            '.category': id,
        };
        this.queryStore.fetch();
    };

    @observable taggingType = 'query';
    handleTypeChange = (key, val) => {
        this[key] = val;
    };

    @observable activeQueryCid = null;
    handleQueryToggle = cid => {
        if (this.activeQueryCid === cid) {
            this.activeQueryCid = null;
            return;
        }
        this.activeQueryCid = cid;
    };
    handleQueryCreate = () => {
        console.log('todo create query');
    };

    render() {
        return (
            <Menu>
                <FormField label="Category">
                    <CategorySelect
                        onChange={this.handleCategorySelect}
                        value={this.categoryId}
                    />
                </FormField>
                <RadioButtons
                    onChange={this.handleTypeChange}
                    options={[
                        { value: 'query', label: 'Query' },
                        { value: 'manual', label: 'Manual' },
                    ]}
                    name="taggingType"
                    value={this.taggingType}
                />
                {this.taggingType === 'query' &&
                    <div>
                        <Button type="button" onClick={this.handleQueryCreate}>
                            Create query
                        </Button>
                        <Overview
                            key="queryOverview"
                            Item={QueryOverviewItem}
                            itemProps={{
                                activeCid: this.activeQueryCid,
                                onClick: this.handleQueryToggle,
                            }}
                            store={this.queryStore}
                        />
                    </div>}
            </Menu>
        );
    }
}
