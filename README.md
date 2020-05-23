# Punions Server


## WebSocket Messages
The connection id is saved as the player id without the '=' symbol.

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
### Response 
Updated players are broadcast to all the players in the game.

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
In the object below, player id is the player who submitted her/his pun and this message is sent by the
other players.
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
