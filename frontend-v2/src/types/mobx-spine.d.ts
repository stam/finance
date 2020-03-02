declare module "mobx-spine" {
  type RequestOptions = any;
  type ModelParsePayload = any;
  class Model {
    url: string;
    clear(): void;
    save(): Promise<void>;
    fromBackend(data: ModelParsePayload): void;
  }

  interface StoreOptions {
    relations?: string[];
    limit?: number;
  }

  class Store {
    constructor(options?: StoreOptions);
    fetch(data?: any): Promise<void>;
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

  class Casts {
    static date: any;
    static datetime: any;
  }

  export { Model, Store, BinderApi, Casts };
}
