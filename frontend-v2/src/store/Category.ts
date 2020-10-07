import { observable, computed } from "mobx";
import { Model, Store, Casts } from "./Base";
import { CategoryType } from "../components/CategoryTag";

export class Category extends Model {
  static backendResourceName = "category";

  @observable id!: number;
  @observable name: string = "";
  @observable icon: string = "";
  @observable color: string = "";
  @observable createdAt: any = null;
  @observable updatedAt: any = null;

  casts() {
    return {
      createdAt: Casts.datetime,
      updatedAt: Casts.datetime,
    };
  }

  @computed get type(): CategoryType {
    const t = this.icon || this.name;
    return t as CategoryType;
  }
}

export class CategoryStore extends Store {
  static backendResourceName = "category";

  @observable models: Category[] = [];

  Model = Category;
}
