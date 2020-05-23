/* eslint-disable require-jsdoc */
const Crypto = require('crypto');
const DB = require('../db/game');

class Game {
  constructor(gameId) {
    this.gameId = gameId;
  }

  static async create() {
    const gameId = Crypto.randomBytes(8).toString('hex').slice(0, 8);
    await DB.createGame(gameId);
    return new Game(gameId);
  }

  async addPlayer(player) {
    const game = await DB.getGame(this.gameId);
    player.order = Object.keys(game.Item.players).length + 1;
    player.playing = (player.order === 1) ? true : false;
    return await DB.addPlayerToGame(this.gameId, player);
  }

  toJson() {
    return {
      gameId: this.gameId
    };
  }
}

module.exports = {
  Game
};
