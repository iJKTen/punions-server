'use strict';

const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.testFunction = async (event, context) => {
  //For a post method
  // const body = JSON.parse(event.body)
  // const username = body.username
  // const password = body.password
  // const newUserParams = {
  //   TableName: process.env.DYNAMODB_USER_TABLE,
  //   Item: {
  //     pk: username,
  //     password: bcrypt.hashSync(password, 10)
  //   }
  // }
  // try {
  //   const dynamodb = new AWS.DynamoDB.DocumentClient()
  //   const putResult = await dynamodb.put(newUserParams).promise()
  //   return {
  //     statusCode: 201,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': true,
  //       'Access-Control-Allow-Headers': 'Authorization'
  //     }
  //   }
  // } catch(putError) {
  //   console.log('There was an error putting the new item')
  //   console.log('putError', putError)
  //   console.log('newUserParams', newUserParams)
  //   return new Error('There was an error putting the new item')
  // }

  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!'
  //   }),
    const data = await documentClient.scan({TableName: process.env.DYNAMODB_CARDS_TABLE}).promise();
    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(data.Items)
    };
    return response;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
