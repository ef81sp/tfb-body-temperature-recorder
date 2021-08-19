import { EventEmitter } from '../EventEmitter.js';
/**
 * @typedef {Object} BodyTemperatureItem
 * @property {Date} date
 * @property {number} bodyTemperature
 */
export class BodyTemperatureListModel extends EventEmitter {
  /**
   *
   * @param {BodyTemperatureItem[]} items
   */
  constructor(items = []) {
    super();
    this.items = items;
  }
  /**
   * @returns {BodyTemperatureItem[]}
   */
  getItems() {
    return this.items;
  }
  /**
   * @param {Function} listener
   */
  onChange(listener) {
    this.addEventListener('change', listener);
  }

  emitChange() {
    this.emit('change');
  }

  /**
   * @param {BodyTemperatureItem} item
   */
  addBodyTemperature(item) {
    this.items.push(item);
    this.emitChange();
  }

  deleteBodyTemperature(date) {
    this.items = this.items.filter((item) => item.date !== date);
    this.emitChange();
  }
}
