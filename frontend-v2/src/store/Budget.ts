import { observable } from "mobx";
import { Model, Store, Casts } from "./Base";
import { CategoryStore } from "./Category";

export class Budget extends Model {
  static backendResourceName = "budget";

  @observable id: string = "";
  @observable name: string = "";
  @observable amount: string = "";
  @observable createdAt: any = null;
  @observable updatedAt: any = null;

  relations() {
    return {
      categories: CategoryStore,
      // dataImport: DataImport
    };
  }

  casts() {
    return {
      createdAt: Casts.datetime,
      updatedAt: Casts.datetime,
    };
  }
}

export class BudgetStore extends Store {
  static backendResourceName = "budget";

  @observable models: Budget[] = [];

  Model = Budget;
}
