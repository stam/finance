import { computed, observable } from "mobx";
import { Model, Store } from "./Base";

interface SpentPerCategory {
  color: string;
  id: number;
  count: number;
  name: string;
  icon: string;
  current: number;
}
interface SpentPerCategoryMapping {
  [categoryId: string]: SpentPerCategory;
}

export class BudgetSummary extends Model {
  static backendResourceName = "budget/summary";

  @observable name: string = "";
  @observable total: number = 0;
  @observable count: number = 0;
  @observable current: number = 0;

  @observable categories: SpentPerCategoryMapping = {};

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
    const income = this.models.find((s) => s.name === "Income")?.current || 0;
    return income === 0 ? 0 : income * -1;
  }

  @computed get remainder() {
    const totalSpent =
      this.models.find((s) => s.name === "Total spent")?.current || 0;

    return this.income - totalSpent;
  }

  @computed get alreadySaved() {
    return this.models.find((s) => s.name === "Saving")?.current || 0;
  }

  Model = BudgetSummary;
}
