import { observable } from "mobx";
import { Model, Store, Casts } from "./Base";

export class Category extends Model {
  static backendResourceName = "category";

  @observable id: string = "";
  @observable name: string = "";
  @observable color: string = "";
  @observable createdAt: any = null;
  @observable updatedAt: any = null;

  casts() {
    return {
      createdAt: Casts.datetime,
      updatedAt: Casts.datetime
    };
  }
}

export class CategoryStore extends Store {
  static backendResourceName = "category";

  @observable models: Category[] = [];

  Model = Category;
}
