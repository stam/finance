import { observable } from 'mobx';
import { Model, Store } from './Base';

export class Balance extends Model {
    static backendResourceName = 'balance';

    @observable id = null;
    @observable amount = null;

    fetchLatest() {
        return this.api.get(`${this.url}latest/`);
    }
}

export class BalanceStore extends Store {
    static backendResourceName = 'balance';

    Model = Balance;
}
