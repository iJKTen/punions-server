'use strict'; 
const AWS = require("aws-sdk");

module.exports.connectionManager = async (event, context) => {
  return {
    statusCode: 200
  };
}

module.exports.sendMessage = async (event, context) => {
  return {
    statusCode: 200
  }
}
