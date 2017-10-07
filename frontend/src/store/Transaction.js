import { observable, computed } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import { Model, Store, Casts } from './Base';

export class Transaction extends Model {
    static backendResourceName = 'transaction';

    @observable id = null;
    @observable description = '';
    @observable direction = 'outgoing';
    @observable date = null;
    @observable details = '';
    @observable sourceAccount = '';
    @observable targetAccount = '';
    @observable type = '';
    @observable amount = null;

    save(file, options = {}) {
        options.params = {
            authorization: this.api.socket.authToken,
        };

        const data = new FormData();
        data.append('file', file);
        return this.api.post(`${this.target}/upload/`, data, options);
    }

    casts() {
        return {
            date: Casts.date, // Grouping breaks if we cast the date
            amount: Casts.currency,
        };
    }

    @computed
    get operator() {
        return this.direction === 'outgoing' ? '-' : '+';
    }
}

export class TransactionStore extends Store {
    static backendResourceName = 'transaction';
    Model = Transaction;

    @computed
    get groupByDate() {
        return groupBy(
            orderBy(this.models, t => t.date._i, 'desc'),
            transaction => transaction.date._i
        );
    }
}
