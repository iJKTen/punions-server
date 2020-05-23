const DB = require('../db/game');
const {safeConnectionId} = require('../utilities/index');

/* eslint-disable require-jsdoc */
class Player {
  constructor(playerId, player = {}) {
    this.playerId = playerId;
    this.name = Object.prototype.hasOwnProperty.call(player, 'name') ? player.name : '';
    this.playing = false;
    this.order = 0;
    this.score = 0;
    this.cards = [];
  }

  async madeMove(gameId, move) {
    return await DB.playerPlayedCard(gameId, this.jsonSafePlayerId(), move);
  }

  async scorePun(gameId, payload) {
    const game = await DB.getGame(gameId);
    let nextPlayerIdToPlay = '';
    const totalScores = game.Item.players[payload.playerId].cards[payload.cardId].totalPlayersScored + 1;

    if (totalScores === process.env.MAX_PLAYERS_PER_GAME - 1) {
      const players = Object.keys(game.Item.players);
      let nextPlayerOrder = game.Item.players[payload.playerId].order + 1;

      if (nextPlayerOrder > process.env.MAX_PLAYERS_PER_GAME) {
        nextPlayerOrder = 1;
      }

      for (let index = 0; index < players.length; index++) {
        const playerId = players[index];
        if (game.Item.players[playerId].order === nextPlayerOrder) {
          nextPlayerIdToPlay = playerId;
          break;
        }
      }
    }

    return await DB.scorePun(gameId, payload, nextPlayerIdToPlay);
  }

  jsonSafePlayerId() {
    // return this.playerId.replace('=', '');
    return safeConnectionId(this.playerId);
  }

  toJson() {
    return {
      'name': this.name,
      'playing': this.playing,
      'order': this.order,
      'score': this.score,
      'cards': {}
    };
  }
}

module.exports = {
  Player
};
