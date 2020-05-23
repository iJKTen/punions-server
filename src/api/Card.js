/* eslint-disable require-jsdoc */
const DB = require('../db/card');

class Card {
  static async getAllCards() {
    return await DB.getAllCards();
  }
}

module.exports = {
  Card
};
