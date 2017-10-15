import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TransactionStore } from '../store/Transaction';
import TransactionOverview from '../container/Transaction/Overview';
import PaginationControls from '../component/Paginate';
import Content from '../component/Content';
import Menu from '../container/Menu';
import { Body, ContentContainer } from 're-cy-cle';
import View from '../store/View';

@observer
export default class TaggingScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.transactionStore = new TransactionStore();
    }

    componentDidMount() {
        this.transactionStore.fetch();
    }

    applyFilter = params => {
        this.transactionStore.params = params;
        this.transactionStore.setPage(1);
    };

    render() {
        return (
            <ContentContainer>
                <Body>
                    <ContentContainer>
                        <Content>
                            <TransactionOverview
                                store={this.transactionStore}
                            />
                        </Content>
                    </ContentContainer>
                    <PaginationControls store={this.transactionStore} />
                </Body>
                <Menu applyFilter={this.applyFilter} />
            </ContentContainer>
        );
    }
}
