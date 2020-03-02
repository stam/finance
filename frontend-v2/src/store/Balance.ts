import { observable, computed } from "mobx";
import { Model, Store } from "./Base";

export class Balance extends Model {
  static backendResourceName = "balance";

  @observable id: string = "";
  @observable amount: number = 0;

  // toBackend(options) {
  //   const data = super.toBackend(options);
  //   if (typeof data.amount === "string") {
  //     data.amount = parseFloat(data.amount) * 100;
  //   }
  //   return data;
  // }

  @computed
  get displayAmount() {
    if (!this.amount) {
      return "???";
    }

    return `€${(this.amount / 100).toLocaleString()}`;
  }

  fetchLatest() {
    return this.api.get(`${Balance.backendResourceName}/latest/`).then(res => {
      this.fromBackend(res);
    });
  }

  // fetchChart(data) {
  //   return this.api.get(`/balance/chart/`, data).then(res => {
  //     this.chart = res.data;
  //   });
  // }
}

export class BalanceStore extends Store {
  static backendResourceName = "balance";
  @observable models: Balance[] = [];
  Model = Balance;
}
