import { observable, computed } from 'mobx';
import { Model, Store } from './Base';
import { Category } from './Category';

export class Aggregate extends Model {
    static backendResourceName = 'category/aggregate';

    @observable id = null;
    @observable name = null;
    @observable color = null;
    @observable sumAmount = null;

    relations() {
        return {
            category: Category,
        };
    }

    @computed
    get displaySumAmount() {
        return parseFloat(this.sumAmount / 100).toFixed(2);
    }
}

export class AggregateStore extends Store {
    static backendResourceName = 'category/aggregate';

    Model = Aggregate;
}
