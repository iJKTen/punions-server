'use strict';

const AWS = require('aws-sdk');
const utilities = require('../utilities/index');
const {Game} = require('../api/Game');
const {Player} = require('../api/Player');

module.exports.createGame = async (event, context) => {
  try {
    const game = await Game.create();
    return utilities.success(game.toJson());
  } catch (err) {
    return utilities.error(err);
  }
};

module.exports.addPlayerToGame = async (event, context) => {
  try {
    const payload = JSON.parse(event.body).payload;
    const player = new Player(event.requestContext.connectionId, payload.player);
    const game = new Game(payload.gameId);
    const data = await game.addPlayer(player);

    await broadcastToAllPlayers(event, data);

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
};

module.exports.playerPlayedCard = async (event, context) => {
  try {
    const payload = JSON.parse(event.body).payload;
    const player = new Player(event.requestContext.connectionId);
    const data = await player.madeMove(payload.gameId, payload.card);

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
};

module.exports.scorePun = async (event, context) => {
  try {
    const payload = JSON.parse(event.body).payload;
    const player = new Player(event.requestContext.connectionId);
    const data = await player.scorePun(payload.gameId, payload.scoreForPlayer);

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
};

module.exports.playerLeftGame = async (event, context) => {
  return utilities.success('player left game');
};

const broadcastToAllPlayers = async (event, payload) => {
  const players = Object.keys(payload.Attributes.players);
  const currentPlayer = utilities.safeConnectionId(event.requestContext.connectionId);
  players.splice(players.indexOf(currentPlayer), 1);

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`
  });

  const promises = players.map((playerId) => {
    return apigwManagementApi.postToConnection({
      ConnectionId: utilities.unsafeConnectionId(playerId),
      Data: JSON.stringify(payload)
    }).promise();
  });

  await Promise.all(promises);
};
