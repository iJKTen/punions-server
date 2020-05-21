const Crypto = require('crypto');
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async () => {
  const gameId = Crypto.randomBytes(8).toString('hex').slice(0, 8);
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Item: {
        id: gameId
    }
  };

  await documentClient.put(params).promise();
  return {
    gameId: gameId
  };
}

const addPlayerToGame = async (gameId, playerId) => {
  playerId = playerId.replace('=', '');
  let player = {}
  player[playerId] = {};

  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    // UpdateExpression: 'set #players = list_append(if_not_exists(#players, :empty_list), :players)',
    UpdateExpression: 'set #players = :players',
    ExpressionAttributeNames: {
      '#players': 'players'
    },
    ExpressionAttributeValues: {
      ':players': player
    },
    ReturnValues: "ALL_NEW"
  };

  return await documentClient.update(params).promise();
}

const playerPlayedCard = async (gameId, playerId, cardId, cardTitle, pun) => {
  playerId = playerId.replace('=', '');
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    UpdateExpression: 'set players.#player = list_append(if_not_exists(#cards, :empty_list), :card)',
    ExpressionAttributeNames: {
      '#cards': 'cards',
      '#player': playerId
    },
    ExpressionAttributeValues: {
      ':card': [{
        "cardId": cardId,
        "cardTitle": cardTitle,
        "pun": pun
      }],
      ':empty_list': []
    },
    ReturnValues: "ALL_NEW"
  };
  return await documentClient.update(params).promise();
}

module.exports = {
  createGame, 
  addPlayerToGame,
  playerPlayedCard
};
