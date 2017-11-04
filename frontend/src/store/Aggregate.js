import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';
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

    casts() {
        return {
            sumAmount: Casts.currency,
        };
    }
}

export class AggregateStore extends Store {
    static backendResourceName = 'category/aggregate';

    Model = Aggregate;
}