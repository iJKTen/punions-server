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
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    UpdateExpression: 'set players = list_append(players, :players)',
    ExpressionAttributeValues: {
      ':players': [{
        "playerId": playerId 
      }]
    }
  };

  return await documentClient.update(params).promise();
}

module.exports = {
  createGame, 
  addPlayerToGame
};
