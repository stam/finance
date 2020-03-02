import { observable } from "mobx";
import { Model, Store } from "./Base";

export class BudgetSummary extends Model {
  static backendResourceName = "budget/summary";

  @observable name: string = "";
  @observable total: number = 0;
  @observable current: number = 0;

  // relations() {
  //     return {
  //         budget: Category,
  //     };
  // }

  // @computed
  // get displaySumAmount() {
  //   return parseFloat(this.sumAmount / 100).toFixed(2);
  // }
}

export class BudgetSummaryStore extends Store {
  static backendResourceName = "budget/summary";

  @observable models: BudgetSummary[] = [];

  Model = BudgetSummary;
}
