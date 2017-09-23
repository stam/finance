import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';

export class DataImport extends Model {
    target = 'data_import';

    @observable id = null;
    @observable date = '';
    @observable filename = '';
    @observable firstTransactionDate = null;
    @observable lastTransactionDate = null;

    save(file, options = {}) {
        options.params = {
            authorization: this.api.socket.authToken,
        };

        const data = new FormData();
        data.append('file', file);
        return this.api.post(`${this.target}/upload/`, data, options);
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
    Model = DataImport;
    target = 'data_import';
}
