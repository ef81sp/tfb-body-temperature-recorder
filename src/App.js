import { element, render } from './view/html-util.js';
import { BodyTemperatureListModel } from './model/BodyTemperatureListModel.js';

const DELETABLE_MILS = 600000; // とりあえず10分
export class App {
  constructor() {
    const savedList = localStorage.getItem('bodyTemperatureList');
    const initializeList = savedList
      ? JSON.parse(savedList).map((item) => ({
          bodyTemperature: item.bodyTemperature,
          date: new Date(item.date),
        }))
      : [];
    this.BodyTemperatureListModel = new BodyTemperatureListModel(
      initializeList
    );
  }
  mount() {
    const formElement = document.querySelector('#body-temperature');
    const inputElement = document.querySelector('#body-temperature-input');
    const containerElement = document.querySelector('#body-temperature-list');

    this.BodyTemperatureListModel.onChange(() => {
      const bodyTemperatureListElement = element`<ul />`;

      const bodyTemperatureItems = this.BodyTemperatureListModel.getItems();
      const now = new Date();
      bodyTemperatureItems
        .slice() // シャローコピー
        .reverse()
        .forEach((item) => {
          const elapsed = now - item.date;
          const itemElement =
            elapsed < DELETABLE_MILS
              ? element`<li>${item.date.toLocaleString()} …… ${
                  item.bodyTemperature
                }℃ <button class="delete">x</button> </li>`
              : element`<li>${item.date.toLocaleString()} …… ${
                  item.bodyTemperature
                }℃</li>`;

          const deleteButtonElement = itemElement.querySelector('.delete');
          if (deleteButtonElement) {
            deleteButtonElement.addEventListener('click', () => {
              this.BodyTemperatureListModel.deleteBodyTemperature(item.date);
              localStorage.setItem(
                'bodyTemperatureList',
                JSON.stringify(this.BodyTemperatureListModel.getItems())
              );
            });
          }
          bodyTemperatureListElement.appendChild(itemElement);
        });
      render(bodyTemperatureListElement, containerElement);
    });

    this.BodyTemperatureListModel.emitChange();
    // 削除時間くらいでリロード
    setInterval(() => {
      this.BodyTemperatureListModel.emitChange();
    }, DELETABLE_MILS);

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!inputElement.value) return;

      this.BodyTemperatureListModel.addBodyTemperature({
        date: new Date(),
        bodyTemperature: Number(inputElement.value),
      });

      localStorage.setItem(
        'bodyTemperatureList',
        JSON.stringify(this.BodyTemperatureListModel.getItems())
      );

      inputElement.value = '';
    });
  }
}
