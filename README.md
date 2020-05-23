# Punions Server


## WebSocket Messages

### Add Player to Game
```
{
  "action": "addPlayerToGame",
  "payload": {
    "gameId": "289c8701",
    "player": {
      "name": "John Doe"
    }
  }
}
```

### Player played card
```
{
  "action": "playerPlayedCard",
  "payload": {
    "gameId": "c0fe3a6b",
    "card": {
      "cardId": "2",
      "cardTitle": "test",
      "pun": "this is a pun"
    }
  }
}
```

### Submit Score
```
{
  "action": "scorePun",
  "payload": {
    "gameId": "c0fe3a6b",
    "scoreForPlayer": {
      "playerId": "M9lf5dmjIAMCK7g",
      "cardId": "2",
      "score": 1
    }
  }
}
```
