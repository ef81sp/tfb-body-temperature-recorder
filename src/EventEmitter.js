export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  /**
   * @param {string} type event name
   * @param {Function} listener event listener
   */
  addEventListener(type, listener) {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, new Set());
    }
    const listenerSet = this._listeners.get(type);
    listenerSet.add(listener);
  }

  /**
   * @param {string} type event name
   */
  emit(type) {
    const listenerSet = this._listeners.get(type);
    if (!listenerSet) return;
    listenerSet.forEach((listener) => {
      listener.call(this);
    });
  }

  /**
   * @param {string} type event name
   * @param {Function} listener event listener
   */
  removeEventListener(type, listener) {
    const listenerSet = this._listeners.get(type);
    if (!listenerSet) return;
    listenerSet.forEach((ownListener) => {
      if (ownListener === listener) {
        listenerSet.delete(listener);
      }
    });
  }
}
