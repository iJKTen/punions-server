const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async (gameId) => {
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

const addPlayerToGame = async (gameId, player) => {
  const expression = 'SET #p.#pId = if_not_exists(#p.#pId, :player)';
  const attributeNames = {
    '#p': 'players',
    '#pId': player.jsonSafePlayerId()
  };
  const values = {
    ':player': player.toJson()
  };

  return await updateGame(gameId, expression, attributeNames, values);
};

const playerPlayedCard = async (gameId, playerId, card) => {
  const expression = 'set #p.#pId.#cards.#cid = if_not_exists(#p.#pId.#cards.#cid, :card)';
  const attributeNames = {
    '#p': 'players',
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
    '#p': 'players',
    '#pId': scoreForPlayer.playerId,
    '#s': 'score',
    '#c': 'cards',
    '#cId': scoreForPlayer.cardId,
    '#t': 'totalPlayersScored'
  };

  const values = {
    ':score': scoreForPlayer.score,
    ':one': 1
  };

  let expression = 'set #p.#pId.#s = #p.#pId.#s + :score, #p.#pId.#c.#cId.#t = #p.#pId.#c.#cId.#t + :one';

  if (nextPlayerIdToPlay.length > 0) {
    expression = expression.concat(', #p.#pId.playing = :f, #p.#nextPId.playing = :t');
    attributeNames['#nextPId'] = nextPlayerIdToPlay;
    values[':f'] = false;
    values[':t'] = true;
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
  addPlayerToGame,
  playerPlayedCard,
  scorePun
};
