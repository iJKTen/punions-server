const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const createGame = async (gameId) => {
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Item: {
        id: gameId
    }
  };

  return await documentClient.put(params).promise();
}

const addPlayerToGame = async (gameId, playerId) => {
  const params = {
    TableName: process.env.DYNAMODB_GAMES_TABLE, 
    Key: {
        id: gameId
    },
    UpdateExpression: 'set #players = list_append(if_not_exists(#players, :empty_list), :playerId)',
    ExpressionAttributeNames: {
      '#players': 'players'
    },
    ExpressionAttributeValues: {
      ':players': [playerId],
      ':empty_list': []
    }
  };

  return await documentClient.update(params);
}

module.exports = {
  createGame, 
  addPlayerToGame
};
