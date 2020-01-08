import { observable } from "mobx";
import { Model, Store } from "./Base";

export class User extends Model {
  target = "user";
  @observable id = "";
  @observable username = "";
  @observable displayName = "";
  @observable email = "";
  @observable avatarUrl = "";

  setToken(token: string) {
    localStorage.setItem("jwt-auth-token", token);
  }

  getToken() {
    return localStorage.getItem("jwt-auth-token");
  }

  logout() {
    localStorage.removeItem("jwt-auth-token");
    this.clear();
  }
}

export class UserStore extends Store {
  Model = User;
  target = "user";
}
