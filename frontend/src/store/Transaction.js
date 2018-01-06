import { observable, computed } from 'mobx';
import { groupBy, orderBy } from 'lodash';
import { Model, Store, Casts } from './Base';
import { Category } from './Category';
import { DataImport } from './DataImport';

export class Transaction extends Model {
    static backendResourceName = 'transaction';

    @observable id = null;
    @observable summary = '';
    @observable direction = 'outgoing';
    @observable date = null;
    @observable details = '';
    @observable sourceAccount = '';
    @observable targetAccount = '';
    @observable type = '';
    @observable amount = null;

    relations() {
        return {
            category: Category,
            dataImport: DataImport,
        };
    }

    casts() {
        return {
            date: Casts.date, // Grouping breaks if we cast the date
        };
    }

    @computed
    get displayAmount() {
        return parseFloat(this.amount / 100).toFixed(2);
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
