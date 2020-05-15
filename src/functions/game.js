'use strict'; 
const AWS = require("aws-sdk");
const db = require('../db/game');
const utilities = require('../utilities/index');

module.exports.createGame = async (event, context) => {
  
  try {
    const data = await db.createGame();
    return utilities.success(data);
  } catch (err) {
    return utilities.error(err);
  }

};

module.exports.addPlayerToGame = async (event, context) => {

  try {
    
  } catch (err) {
    return utilities.error(err);
  }

}