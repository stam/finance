import { observable, computed } from 'mobx';
import { Model, Store } from './Base';
import { DataImport } from './DataImport';

export class Balance extends Model {
    static backendResourceName = 'balance';

    @observable id = null;
    @observable amount = null;

    @observable chart = [];

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

    fetchChart(data) {
        return this.api.get(`/balance/chart/`, data).then(res => {
            this.chart = res.data;
        });
    }
}

export class BalanceStore extends Store {
    static backendResourceName = 'balance';

    Model = Balance;
}
