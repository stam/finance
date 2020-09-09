import { observable } from "mobx";
import { Model, Store, Casts } from "./Base";
import { CategoryStore } from "./Category";

let nextId = -1;

export class Budget extends Model {
  static backendResourceName = "budget";

  @observable id: number = nextId;
  @observable name: string = "";
  @observable amount: number = 0;
  @observable createdAt: any = null;
  @observable updatedAt: any = null;

  constructor(...args: any[]) {
    super(...args);
    nextId -= 1;
  }

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
