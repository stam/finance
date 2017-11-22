import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Menu } from '../component/SideMenu';
import { FormField, RadioButtons, Button } from 're-cy-cle';
import CategorySelect from './Category/Select';
import { QueryStore } from '../store/Query';
import Overview from './Overview';
import QueryOverviewItem from './Query/OverviewItem';

@observer
export default class TaggingMenu extends Component {
    static propTypes = {
        applyFilter: PropTypes.func.isRequired,
        onQuerySave: PropTypes.func.isRequired,
        updateManualTagging: PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.queryStore = new QueryStore({
            relations: ['category'],
        });
        this.queryStore.setComparator();
        this.queryStore.fetch();
    }

    handleFilter = matcher => {
        this.props.applyFilter(matcher.toStoreParams());
    };

    @observable category = null;
    handleCategorySelect = category => {
        this.category = category;
        this.queryStore.params = {
            '.category': category.id,
        };
        this.queryStore.fetch();

        this.updateManualTagging();
    };

    @observable taggingType = 'query';
    handleTypeChange = (key, val) => {
        this[key] = val;
        this.updateManualTagging();
    };

    // Enables the onclick => tag behavior
    // if both taggingType = manual, and a category is selected
    updateManualTagging = () => {
        if (this.category !== null && this.taggingType === 'manual') {
            this.props.updateManualTagging(this.category);
            return;
        }
        this.props.updateManualTagging(null);
    };

    @observable activeQueryCid = null;
    handleQueryToggle = cid => {
        if (this.activeQueryCid === cid) {
            this.activeQueryCid = null;
            return;
        }
        this.activeQueryCid = cid;
    };

    @action
    handleQueryCreate = () => {
        const q = this.queryStore.add({});
        this.activeQueryCid = q.cid;
    };

    handleSave = query => {
        if (query.isNew) {
            query.category = this.category;
            query.save();
            // refetch
        } else {
            console.log('TODO handle existing query save');
        }
    };

    render() {
        return (
            <Menu>
                <FormField label="Category">
                    <CategorySelect onChange={this.handleCategorySelect} />
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
                    <Overview
                        key="queryOverview"
                        Item={QueryOverviewItem}
                        itemProps={{
                            activeCid: this.activeQueryCid,
                            onClick: this.handleQueryToggle,
                            applyFilter: this.handleFilter,
                            onSave: this.handleSave,
                        }}
                        store={this.queryStore}
                        scroll
                    />}
                {this.taggingType === 'query' &&
                    <Button type="button" onClick={this.handleQueryCreate}>
                        Create query
                    </Button>}
            </Menu>
        );
    }
}
