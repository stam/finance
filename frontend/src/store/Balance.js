import { observable, computed } from 'mobx';
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

    @computed
    get displayAmount() {
        if (this.amount !== null) {
            return parseFloat(this.amount / 100).toFixed(2);
        }
        return t('balance.field.value.undefined');
    }

    fetchLatest() {
        return this.api.get(`${this.url}latest/`).then(res => {
            this.fromBackend(res);
        });
    }
}

export class BalanceStore extends Store {
    static backendResourceName = 'balance';

    Model = Balance;
}
