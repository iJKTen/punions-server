/* eslint-disable require-jsdoc */
const Crypto = require('crypto');
const DB = require('../db/game');
const {Card} = require('./Card');

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

  async getUnplayedCard() {
    const game = await DB.getGame(this.gameId);
    const cards = await Card.getAllCards();
    const playedCards = [];
    const players = Object.keys(game.Item.players);

    players.forEach((playerId) => {
      Array.prototype.push.apply(playedCards, Object.keys(game.Item.players[playerId].cards));
    });

    if (playedCards.length > 0) {
      const unplayedCards = cards.Items.filter((card) => {
        if (playedCards.includes(card.id)) {
          return card.id;
        }
      });
      return unplayedCards.length > 0 ? unplayedCards[0] : null;
    }

    return cards.Items[0];
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
