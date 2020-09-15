import { observable } from "mobx";
import { Model, Store, Casts } from "./Base";

export class DataImport extends Model {
  static backendResourceName = "data_import";

  @observable id!: number;
  @observable date: any = "";
  @observable filename: string = "";
  @observable firstTransactionDate: string = "";
  @observable lastTransactionDate: string = "";

  // save(file, options = {}) {
  //   const data = new FormData();
  //   data.append("file", file);
  //   return this.api.post(
  //     `${DataImportStore.backendResourceName}/upload/`,
  //     data,
  //     options
  //   );
  // }

  casts() {
    return {
      date: Casts.datetime,
      firstTransactionDate: Casts.date,
      lastTransactionDate: Casts.date,
    };
  }
}

export class DataImportStore extends Store {
  static backendResourceName = "data_import";

  @observable loading = false;

  Model = DataImport;

  async scrape() {
    this.loading = true;
    const res = await this.api.post(
      `${DataImportStore.backendResourceName}/scrape/`
    );
    this.loading = false;
    return res;
  }
}
