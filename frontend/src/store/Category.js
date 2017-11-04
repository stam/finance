import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';

export class Category extends Model {
    static backendResourceName = 'category';

    @observable id = null;
    @observable name = '';
    @observable color = '';
    @observable createdAt = null;
    @observable updatedAt = null;

    casts() {
        return {
            createdAt: Casts.datetime,
            updatedAt: Casts.datetime,
        };
    }
}

export class CategoryStore extends Store {
    static backendResourceName = 'category';

    Model = Category;

    fetchAggregate(date) {
        const options = {
            data: {
                start_date: date.clone().startOf('month').format('YYYY-MM-DD'),
                end_date: date.clone().endOf('month').format('YYYY-MM-DD'),
            },
            url: `${this.constructor.backendResourceName}/aggregate/`,
        };
        return this.fetch(options);
    }
}
