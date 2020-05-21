'use strict'; 
const AWS = require("aws-sdk");
const db = require('../db/game');
const utilities = require('../utilities/index');

module.exports.createGame = async (event, context) => {
  try {
    const data = await db.createGame();
    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
};

module.exports.playerLeftGame = async (event, context) => {
  return utilities.success('player left game');
}

module.exports.sendMessage = async (event, context) => {

  // Add player to Game: gameId, connectionId, playerName
  // playerPlayedCard: gameId, connectionId, cardId, cardTitle, pun
  // scorePun: gameId, connectionId, cardId, currentPlayer, score

  //event.requestContext.routeKey === "sendMessage"
  //event.requestContext.connectionId
  let {action, payload} = JSON.parse(event.body);
  console.log(action);
  console.log(payload.method);
  console.log(event.body);
  console.log(event);
  console.log(context);
  return utilities.success(event);
}

module.exports.addPlayerToGame = async (event, context) => {
  try {
    const {action, payload} = JSON.parse(event.body);
    const playerId = event.requestContext.connectionId;
    const data = await db.addPlayerToGame(payload.gameId, playerId, payload.name);

    // Have to broadcast player ids to all the players so when they score a pun
    // we can track who the score is for.

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
      // apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
    });

    const players = await db.players(payload.gameId);
    const dataStr = JSON.stringify(data);
    players.forEach((player) => {
      let connectionId = `${player}=`
      if(connectionId !== playerId) {
        apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: dataStr }).promise();
      }
    })

    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}

module.exports.playerPlayedCard = async (event, context) => {
  try {
    const {action, payload} = JSON.parse(event.body);
    const playerId = event.requestContext.connectionId;
    const data = await db.playerPlayedCard(payload.gameId, playerId, payload.cardId, payload.cardTitle, payload.pun);
    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}

module.exports.scorePun = async (event, context) => {
  try {
    const {action, payload} = JSON.parse(event.body);
    const playerId = event.requestContext.connectionId;
    const data = await db.scorePun(payload.gameId, playerId, payload.cardId, payload.score);
    if(Object.keys(data.Attributes.players) === process.env.DYNAMODB_GAMES_TABLE) {

    }
    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }
}
