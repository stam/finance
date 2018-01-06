import { observable } from 'mobx';
import { Model, Store } from './Base';
import { DataImport } from './DataImport';

export class Balance extends Model {
    static backendResourceName = 'balance';

    @observable id = null;
    @observable amount = null;

    relations() {
        return {
            afterImport: DataImport,
        };
    }

    toBackend(options) {
        const data = super.toBackend(options);
        if (typeof data.amount === 'string') {
            data.amount = parseFloat(data.amount) * 100;
        }
        return data;
    }

    fetchLatest() {
        return this.api.get(`${this.url}latest/`);
    }
}

export class BalanceStore extends Store {
    static backendResourceName = 'balance';

    Model = Balance;
}
