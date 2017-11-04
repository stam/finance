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
}
