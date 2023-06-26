/**
 * Promise wrapper which can be resolved outside execution context
 */
export class AsyncPromise<T> {
  private _resolve: (value: T | PromiseLike<T>) => void;
  private _reject: (reason?: any) => void;
  private _promise: Promise<T>;
  private _value: T = null;
  constructor() {
    this._promise = new Promise((res, rej) => {
      this._resolve = res;
      this._reject = rej;
    })
  }

  promise() {
    return this._promise;
  }

  resolve(value: T) {
    this._value = value;
    this._resolve(value)
  }

  reject(reason?: any) {
    this._reject(reason);
  }

  get(): T | null {
    return this._value;
  }
}