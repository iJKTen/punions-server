'use strict'; 
const AWS = require("aws-sdk");
const db = require('../db/game');
const utilities = require('../utilities/index');
const { Game } = require('../api/Game');
const { Player } = require('../api/Player');

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
    const {action, payload} = JSON.parse(event.body);
    const player = new Player(event.requestContext.connectionId, payload.player)
    const game = new Game(payload.gameId);
    const data = await game.addPlayer(player);

    await broadcastToAllPlayers(event, data);

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}

module.exports.playerPlayedCard = async (event, context) => {
  try {
    const {action, payload} = JSON.parse(event.body);
    const player = new Player(event.requestContext.connectionId);
    const data = await player.madeMove(payload.gameId, payload.card);

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}

module.exports.scorePun = async (event, context) => {
  try {
    const {action, payload} = JSON.parse(event.body);
    const player = new Player(event.requestContext.connectionId);
    const data = await player.scorePun(payload.gameId, payload.scoreForPlayer);
    
    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}

module.exports.playerLeftGame = async (event, context) => {
  return utilities.success('player left game');
}

const broadcastToAllPlayers = async (event, payload) => {
  const players = Object.keys(payload.Attributes.players);
  let cPlayerId = event.requestContext.connectionId.replace('=', '');
  players.splice(players.indexOf(cPlayerId), 1);

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });

  const promises = players.map((pId) => {
    const connectionId = `${pId}=`;
    return apigwManagementApi.postToConnection({ 
      ConnectionId: connectionId, 
      Data: JSON.stringify(payload)
    }).promise();
  })

  await Promise.all(promises);
}
