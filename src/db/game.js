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

const addPlayerToGame = async (gameId, playerId, name) => {
  playerId = playerId.replace('=', '');

  let playing = false;
  const game = await getGame(gameId);
  let order = Object.keys(game.Item.players).length;
  if(order === 0) {
    playing = true;
  }
  order++;

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
        "name": name,
        "cards": {},
        "score": 0,
        "playing": playing,
        "order": order
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
    UpdateExpression: 'set #players.#pId.#cards.#cid = if_not_exists(#players.#pId.#cards.#cid, :card)',
    ExpressionAttributeNames: {
      '#players': 'players',
      '#pId': playerId,
      '#cards': 'cards',
      '#cid': cardId
    },
    ExpressionAttributeValues: {
      ':card': {
        "cardTitle": cardTitle,
        "pun": pun,
        "totalPlayersScored": 0
      }
    },
    ReturnValues: "ALL_NEW"
  };
  return await documentClient.update(params).promise();
}

const scorePun = async (gameId, playerId, cardId, score) => {
  playerId = playerId.replace('=', '');

  let expressionAttributeNames = {
    '#pId': playerId,
      '#s': 'score',
      '#c': 'cards',
      '#cId': cardId,
      '#t': 'totalPlayersScored'
  }
  let updateExpression = 'set players.#pId.#s = players.#pId.#s + :score, players.#pId.#c.#cId.#t = players.#pId.#c.#cId.#t + :one';

  const game = await getGame(gameId);
  if(game.Item.players[playerId].cards[cardId].totalPlayersScored === process.env.MAX_PLAYERS_PER_GAME - 1) {
    updateExpression = 'set players.#pId.#s = players.#pId.#s + :score, players.#pId.#c.#cId.#t = players.#pId.#c.#cId.#t + :one, players.#pId.playing = false';

    //Find the next player
    const players = Object.keys(game.Item.players);
    let nextPlayerOrder = game.Item.players[playerId].order + 1;
    players.forEach((p) => {
      if(process.env.MAX_PLAYERS_PER_GAME + 1 === nextPlayerOrder) {
        nextPlayerOrder = 0;
      }
      console.log(p, nextPlayerOrder, game.Item.players[p].order)
      if(game.Item.players[p].order === nextPlayerOrder) {
        updateExpression = 'set players.#pId.#s = players.#pId.#s + :score, players.#pId.#c.#cId.#t = players.#pId.#c.#cId.#t + :one, players.#pId.playing = false, players.#nextPId.playing = true';
        expressionAttributeNames['#nextPId'] = p;
      }
    });
    console.log(updateExpression);
    console.log(expressionAttributeNames);
  }

  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE,
    Key: {
        id: gameId
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: {
      ':score': score,
      ':one': 1
    },
    ReturnValues: "ALL_NEW"
  };
  return await documentClient.update(params).promise();
}

const getGame = async (gameId) => {
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    }
  };
  return await documentClient.get(params).promise();
}

const players = async (gameId) => {
  const game = await getGame(gameId);
  return Object.keys(game.Item.players);
}

module.exports = {
  createGame, 
  addPlayerToGame,
  playerPlayedCard,
  scorePun,
  players
};
