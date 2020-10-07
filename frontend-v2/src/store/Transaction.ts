import { observable, computed } from "mobx";
import { groupBy, orderBy } from "lodash";
import { Model, Store, Casts } from "./Base";
import { Category } from "./Category";

export class Transaction extends Model {
  static backendResourceName = "transaction";

  @observable id!: number;
  @observable summary = "";
  @observable direction = "outgoing";
  @observable date: any = null;
  @observable details = "";
  @observable sourceAccount = "";
  @observable targetAccount = "";
  @observable type = "";
  @observable amount = 0;

  // category?: Category;

  // @computed get categoryName() {
  //   // @ts-ignore
  //   const category = this.category;
  //   if (!category) {
  //     return null;
  //   }

  //   return category.type;
  // }

  @computed get rCategory(): Category | undefined {
    // @ts-ignore
    return this.category;
  }

  relations() {
    return {
      category: Category,
      // dataImport: DataImport
    };
  }

  casts() {
    return {
      date: Casts.date, // Grouping breaks if we cast the date
    };
  }

  @computed
  get displayAmount() {
    return (this.amount / 100).toFixed(2);
  }
}

export class TransactionStore extends Store {
  static backendResourceName = "transaction";
  Model = Transaction;
  @observable models: Transaction[] = [];

  @computed
  get groupByDate() {
    return groupBy(
      orderBy(this.models, (t) => t.date._i, "desc"),
      (transaction) => transaction.date._i
    );
  }
}
