import { computed, observable } from "mobx";
import { Model, Store } from "./Base";

export class BudgetSummary extends Model {
  static backendResourceName = "budget/summary";

  @observable name: string = "";
  @observable total: number = 0;
  @observable count: number = 0;
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

  @computed get budgetModels() {
    return this.models.filter(
      (s) =>
        !["Saving", "Total spent", "Income", "Uncategorised"].includes(s.name)
    );
  }

  @computed get uncategorisedCount() {
    return this.models.find((s) => s.name === "Uncategorised")?.count || 0;
  }

  @computed get income() {
    return this.models.find((s) => s.name === "Income")?.current || 0;
  }

  @computed get remainder() {
    const totalSpent =
      this.models.find((s) => s.name === "Total spent")?.current || 0;
    return -1 * (totalSpent + this.income);
  }

  @computed get alreadySaved() {
    return this.models.find((s) => s.name === "Saving")?.current || 0;
  }

  Model = BudgetSummary;
}
