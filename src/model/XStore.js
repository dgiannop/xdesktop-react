export class XStore {
    constructor() {
        this._version = 0;
        this._listeners = new Set();
    }

    subscribe(listener) {
        this._listeners.add(listener);

        return () => {
            this._listeners.delete(listener);
        };
    }

    notify() {
        this._version++;

        for (const listener of this._listeners)
            listener(this._version);
    }
}
