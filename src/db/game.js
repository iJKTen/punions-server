const Crypto = require('crypto');
const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async () => {
  const gameId = Crypto.randomBytes(8).toString('hex').slice(0, 8);

  // Add the players key when creating a new game because when it comes to adding players
  // the player id is going to be the connection id you get from the web socket. 
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Item: {
        id: gameId,
        "players": { }
    }
  };

  await documentClient.put(params).promise();
  return {
    gameId: gameId
  };
}

const addPlayerToGame = async (gameId, playerId) => {
  playerId = playerId.replace('=', '');

  // Becuase you created a players map when creating a game you can now add a player
  // at the path players.playerId where playerId is passed as the attribute name. 
  // You want to create a new players.playerid if that path does not exist and player id is set in
  // ExpressionAttributeNames.
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    UpdateExpression: 'SET #players.#playerId = if_not_exists(#players.#playerId, :player)',
    ExpressionAttributeNames: {
      '#players': 'players',
      '#playerId': playerId
    },
    ExpressionAttributeValues: {
      ':player': {
        "cards": [],
        "score": 0
      }
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
    UpdateExpression: 'set #players.#playerId.#cards = list_append(#players.#playerId.#cards, :card)',
    ExpressionAttributeNames: {
      '#players': 'players',
      '#playerId': playerId,
      '#cards': 'cards'
    },
    ExpressionAttributeValues: {
      ':card': [{
        "cardId": cardId,
        "cardTitle": cardTitle,
        "pun": pun
      }]
    },
    ReturnValues: "ALL_NEW"
  };
  return await documentClient.update(params).promise();
}

const scorePun = async (gameId, playerId) => {
  playerId = playerId.replace('=', '');
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    UpdateExpression: 'set players.#playerId.#score = players.#playerId.#score + :s',
    ExpressionAttributeNames: {
      '#playerId': playerId,
      '#score': 'score'
    },
    ExpressionAttributeValues: {
      ':s': 1
    },
    ReturnValues: "ALL_NEW"
  };
  return await documentClient.update(params).promise();
}

module.exports = {
  createGame, 
  addPlayerToGame,
  playerPlayedCard,
  scorePun
};
