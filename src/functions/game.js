'use strict';
const Crypto = require('crypto');
const AWS = require("aws-sdk");
const db = require('../db/game');

module.exports.createGame = async (event, context) => {
  const randomGameId = Crypto.randomBytes(8).toString('hex').slice(0, 8);
  await db.createGame(randomGameId);
  
  const response = {
    statusCode: 200,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
        gameId: randomGameId
    })
  };
  
  return response;
};