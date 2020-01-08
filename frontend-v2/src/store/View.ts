import { observable, computed, action } from "mobx";
import { get } from "lodash";

import { User } from "./User";
import { api } from "./Base";

export class ViewStore {
  @observable currentUser = new User();
  @observable bootstrapCode?: number;
  // @observable notifications = [];

  @computed
  get isAuthenticated() {
    return !!this.currentUser.id;
  }

  constructor() {
    this.fetchBootstrap();
    api.onRequestError = this.handleRequestError;
  }

  // @action
  // setModal(modal) {
  //   this.currentModal = modal;
  // }

  handleRequestError = (err: Error) => {
    console.error(err);
    // Try to show http status code to user
    // const status = get(err, "response.status", err.message);
    // this.showNotification({
    //   key: "requestError",
    //   dismissAfter: 4000,
    //   message: `Error ${status}`
    // });
  };

  @action
  fetchBootstrap() {
    this.bootstrapCode = undefined;
    // You can see here that we use `action()` twice. `action()` is kind of a transaction (events will be fired only when it's done)
    // Technically we wouldn't need the @action in this case (since you only change stuff in the Promise).
    return api
      .get(
        "/bootstrap/",
        this.currentUser.api.buildFetchModelParams(this.currentUser)
      )
      .then(
        action((res: any) => {
          // this.appVersion = res.version;
          this.bootstrapCode = 200;
          if (res.user) {
            this.currentUser.fromBackend({
              data: res.user,
              repos: res.with,
              relMapping: res.with_mapping
            });
          } else {
            this.currentUser.clear();
          }
          api.csrfToken = res.csrf_token;
        })
      )
      .catch((err: any) => {
        this.bootstrapCode = parseInt(get(err, "response.status", 500));
        throw err;
      });
  }

  @action
  performLogin(username: string, password: string) {
    return api
      .post("/user/login/", {
        username,
        password
      })
      .then(() => this.fetchBootstrap());
  }

  @action
  performLogout() {
    return api.post("/user/logout/").then(() => this.fetchBootstrap());
  }

  // @action
  // showNotification(msg) {
  //   // Notifications with the same key have the same contents, so we don't want to display them twice.
  //   // Existing ones are removed so the notification stays longer on the screen.
  //   const existingMsg = this.notifications.find(a => a.key === msg.key);
  //   if (existingMsg) {
  //     this.notifications.remove(existingMsg);
  //   }
  //   this.notifications.push(msg);
  // }
}

const viewStore = new ViewStore();
export default viewStore;
