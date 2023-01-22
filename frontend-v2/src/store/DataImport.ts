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
  pollingInterval?: ReturnType<typeof setInterval>;

  Model = DataImport;

  async scrape() {
    this.loading = true;

    this.pollingInterval = setInterval(() => {
      this.getStatus();
    }, 1000);

    let res;

    try {
      res = await this.api.post(
        `${DataImportStore.backendResourceName}/scrape/`
      );
    } finally {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    }

    this.loading = false;
    return res;
  }

  private async getStatus() {
    const res = await this.api.get(
      `${DataImportStore.backendResourceName}/status/`
    );
    console.log("getStatus", res);
  }
}
