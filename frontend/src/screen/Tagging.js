import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TransactionStore } from '../store/Transaction';
import TransactionOverview from '../container/Transaction/Overview';
import View from '../store/View';

@observer
export default class TaggingScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    subscribe = () => {
        this.transactionStore.clear();
        this.transactionStore.subscribe();
    };

    unsubscribe = () => {
        this.transactionStore.unsubscribe();
        this.transactionStore.clear();
    };

    componentWillMount() {
        this.transactionStore = new TransactionStore();
    }

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div>
                <TransactionOverview store={this.transactionStore} />
            </div>
        );
    }
}
