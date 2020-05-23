const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async (gameId) => {
  // Add the players key when creating a new game because when it comes to adding players
  // the player id is going to be the connection id you get from the web socket. 
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE,
    Item: {
      'id': gameId,
      'players': { }
    }
  };

  await documentClient.put(params).promise();
  return gameId;
};

const addPlayerToGameTwo = async (gameId, player) => {
  const expression = 'SET #players.#pId = if_not_exists(#players.#pId, :player)';
  const attributeNames = {
    '#players': 'players',
    '#pId': player.jsonSafePlayerId()
  };
  const values = {
    ':player': player.toJson()
  };

  return await updateGame(gameId, expression, attributeNames, values);
};

const playerPlayedCard = async (gameId, playerId, card) => {
  const expression = 'set #players.#pId.#cards.#cid = if_not_exists(#players.#pId.#cards.#cid, :card)';
  const attributeNames = {
    '#players': 'players',
    '#pId': playerId,
    '#cards': 'cards',
    '#cid': card.cardId
  };
  const values = {
    ':card': {
      'cardTitle': card.cardTitle,
      'pun': card.pun,
      'totalPlayersScored': 0
    }
  };

  return await updateGame(gameId, expression, attributeNames, values);
};

const scorePun = async (gameId, scoreForPlayer, nextPlayerIdToPlay) => {

  const attributeNames = {
    '#pId': scoreForPlayer.playerId,
    '#s': 'score',
    '#c': 'cards',
    '#cId': scoreForPlayer.cardId,
    '#t': 'totalPlayersScored'
  };

  const values = {
    ':score': scoreForPlayer.score,
    ':one': 1,
    ':f': false,
    ':t': true
  };

  let expression = 'set players.#pId.#s = players.#pId.#s + :score, players.#pId.#c.#cId.#t = players.#pId.#c.#cId.#t + :one';

  if (nextPlayerIdToPlay.length > 0) {
    expression = expression.concat(', players.#pId.playing = :f, players.#nextPId.playing = :t');
    attributeNames['#nextPId'] = nextPlayerIdToPlay;
  }

  return await updateGame(gameId, expression, attributeNames, values);
};

const getGame = async (gameId) => {
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE,
    Key: {
      id: gameId
    }
  };

  return await documentClient.get(params).promise();
};

const updateGame = async (gameId, expression, names, values) => {
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE,
    Key: {
      id: gameId
    },
    UpdateExpression: expression,
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
    ReturnValues: 'ALL_NEW'
  };

  return await documentClient.update(params).promise();
};

module.exports = {
  createGame,
  getGame,
  addPlayerToGameTwo,
  playerPlayedCard,
  scorePun
};
