declare module "mobx-spine" {
  type RequestOptions = any;
  type ModelParsePayload = any;
  class Model {
    constructor(options?: any);
    url: string;
    cid: string;
    id: number;
    clear(): void;
    delete(): Promise<void>;
    save(): Promise<void>;
    saveAll(options: any): Promise<void>;
    fromBackend(data: ModelParsePayload): void;
  }

  interface StoreOptions {
    relations?: string[];
    limit?: number;
  }

  class Store {
    constructor(options?: StoreOptions);
    fetch(data?: any): Promise<void>;
    add(model: any): void;
    removeById(id: number): void;
    remove(model: any): void;
    get(id: number): BinderModel | undefined;
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
