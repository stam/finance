import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';

export class DataImport extends Model {
    static backendResourceName = 'data_import';

    @observable id = null;
    @observable date = '';
    @observable filename = '';
    @observable firstTransactionDate = null;
    @observable lastTransactionDate = null;

    save(file, options = {}) {
        const data = new FormData();
        data.append('file', file);
        return this.api.post(`${this.constructor.backendResourceName}/upload/`, data, options);
    }

    casts() {
        return {
            date: Casts.datetime,
            firstTransactionDate: Casts.date,
            lastTransactionDate: Casts.date,
        };
    }
}

export class DataImportStore extends Store {
    static backendResourceName = 'data_import';

    Model = DataImport;

    async scrape() {
        this.api.post(`${this.constructor.backendResourceName}/scrape/`);
    }
}
