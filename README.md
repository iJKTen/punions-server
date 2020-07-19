# Punions Server


## WebSocket Messages
The connection id is saved as the player id without the '=' symbol.

### Get an unplayed card
```
{
  "action": "unplayedCard",
  "payload": {
    "gameId": "170303f1"
  }
}
```

### Response
```
{
  "id": "2",
  "title": "Carrot"
}
```

### Add Player to Game
```
{
  "action": "addPlayerToGame",
  "payload": {
    "gameId": "f3687d1f",
    "player": {
      "name": "John Doe"
    }
  }
}
```
### Response 
Broadcast the following response to all the players

```
{
  "Attributes": {
    "id": "f3687d1f",
    "players": {
      "M9w-OeF-IAMCIfg": {
        "name": "Jane Doe",
        "score": 0,
        "playing": false,
        "cards": {},
        "order": 2
      },
      "M9w8BfL2IAMCFWw": {
        "name": "John Doe",
        "score": 0,
        "playing": true,
        "cards": {},
        "order": 1
      }
    }
  },
  "action": "playerAdded"
}
```

### Player played card
```
{
  "action": "playerPlayedCard",
  "payload": {
    "gameId": "f3687d1f",
    "card": {
      "cardId": "2",
      "cardTitle": "test",
      "pun": "this is a pun"
    }
  }
}
```

### Submit Score
In the object below, player id is the player who submitted her/his pun and this message is sent by the
other players.
```
{
  "action": "scorePun",
  "payload": {
    "gameId": "f3687d1f",
    "scoreForPlayer": {
      "playerId": "M9lf5dmjIAMCK7g",
      "cardId": "2",
      "score": 1
    }
  }
}
```
