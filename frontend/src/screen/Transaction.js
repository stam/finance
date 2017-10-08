import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TransactionStore } from '../store/Transaction';
import TransactionOverview from '../container/Transaction/Overview';
import View from '../store/View';

@observer
export default class TransactionScreen extends Component {
    static propTypes = {
        viewStore: PropTypes.instanceOf(View).isRequired,
    };

    componentWillMount() {
        this.transactionStore = new TransactionStore();
    }

    componentDidMount() {
        this.transactionStore.fetch();
    }

    render() {
        return (
            <div>
                <TransactionOverview store={this.transactionStore} />
            </div>
        );
    }
}
