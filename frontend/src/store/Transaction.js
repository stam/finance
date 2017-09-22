import { observable, computed } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import { Model, Store, Casts } from './Base';

export class Transaction extends Model {
    target = 'transaction';

    @observable id = null;
    @observable description = '';
    @observable direction = 'subtract';
    @observable processedAt = null;
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
            processedAt: Casts.date,
            amount: Casts.currency,
        };
    }

    @computed get operator() {
        return this.direction === 'subtract' ? '-' : '+';
    }
}

export class TransactionStore extends Store {
    Model = Transaction;
    target = 'transaction';

    @computed
    get groupByDate() {
        return groupBy(
            orderBy(this.models, 'processedAt', 'desc'),
            transaction => transaction.processedAt
        );
    }
}
