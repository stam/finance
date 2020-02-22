declare module "mobx-spine" {
  type RequestOptions = any;
  type ModelParsePayload = any;
  class Model {
    url: string;
    clear(): void;
    fromBackend(data: ModelParsePayload): void;
  }

  class Store {
    fetch(data: any): Promise<void>;
  }

  class BinderApi {
    csrfToken: string;
    onRequestError?(err: Error): void;
    buildFetchModelParams(model: Model): RequestOptions;
    get(route: string, params?: any, options?: RequestOptions): Promise<any>;
    post(route: string, params?: any, options?: RequestOptions): Promise<any>;
    patch(route: string, params?: any, options?: RequestOptions): Promise<any>;
    put(route: string, params?: any, options?: RequestOptions): Promise<any>;
    delete(route: string, params?: any, options?: RequestOptions): Promise<any>;
  }

  class Casts {}

  export { Model, Store, BinderApi, Casts };
}
