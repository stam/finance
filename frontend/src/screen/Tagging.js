import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TransactionStore } from '../store/Transaction';
import TransactionOverview from '../container/Transaction/Overview';
import PaginationControls from '../component/Paginate';
import Content from '../component/Content';
import TaggingMenu from '../container/TaggingMenu';
import { Body, ContentContainer } from 're-cy-cle';
import View from '../store/View';

@observer
export default class TaggingScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    defaultParams = {
        '.category:isnull': '1',
    };

    componentWillMount() {
        this.transactionStore = new TransactionStore({
            relations: ['category'],
        });
        this.transactionStore.params = this.defaultParams;
    }

    componentDidMount() {
        this.transactionStore.fetch();
    }

    applyFilter = params => {
        this.transactionStore.params = { ...params, ...this.defaultParams };
        this.transactionStore.setPage(1);
    };

    manualTagCategory = null;

    // category can be null
    updateManualTagging = category => {
        this.manualTagCategory = category;
    };

    handleTransactionClick = transaction => {
        if (this.manualTagCategory) {
            if (transaction.category.id) {
                console.log(
                    'TODO handle transaction which already has a category'
                );
                return;
            }
            transaction.category = this.manualTagCategory;
            transaction.save();
        }
    };

    render() {
        return (
            <ContentContainer>
                <Body>
                    <ContentContainer>
                        <Content>
                            <TransactionOverview
                                store={this.transactionStore}
                                onTransactionClick={this.handleTransactionClick}
                            />
                        </Content>
                    </ContentContainer>
                    <PaginationControls store={this.transactionStore} />
                </Body>
                <TaggingMenu
                    applyFilter={this.applyFilter}
                    updateManualTagging={this.updateManualTagging}
                    onQuerySave={() => {
                        this.applyFilter({});
                    }}
                />
            </ContentContainer>
        );
    }
}
