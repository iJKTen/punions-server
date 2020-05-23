const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

const getAllCards = async () => {
  return await documentClient.scan({TableName: process.env.DYNAMODB_CARDS_TABLE}).promise();
};

module.exports = getAllCards;
