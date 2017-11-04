import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';
import { Category } from './Category';

export class Aggregate extends Model {
    static backendResourceName = 'aggregate';

    @observable id = null;
    @observable name = '';
    @observable color = '';
    @observable amount = null;

    relations() {
        return {
            category: Category,
        };
    }

    casts() {
        return {
            amount: Casts.currency,
        };
    }
}

export class AggregateStore extends Store {
    static backendResourceName = 'aggregate';

    Model = Aggregate;
}
