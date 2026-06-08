var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    { Server } = require('socket.io'),
    io = new Server(server),
    GameCollection = require('./games.js').GameCollection,
    games = new GameCollection();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mkjs'
});

pool.query(`
  CREATE TABLE IF NOT EXISTS connections (
    id SERIAL PRIMARY KEY,
    socket_id VARCHAR(100),
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(console.error);

app.use(express.static(__dirname + '/../game'));

server.listen(55555, () => {
    console.log('Server is running on port 55555');
});

var Responses = {
    SUCCESS: 0,
    GAME_EXISTS: 1,
    GAME_NOT_EXISTS: 2,
    GAME_FULL: 3
  },
  Requests = {
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game'
  };

io.sockets.on('connection', function (socket) {
  pool.query('INSERT INTO connections (socket_id) VALUES ($1)', [socket.id]).catch(console.error);
  
  socket.on(Requests.CREATE_GAME, function (gameName) {
    if (games.createGame(gameName)) {
      games.getGame(gameName).addPlayer(socket);
      socket.emit('response', Responses.SUCCESS);
    } else {
      socket.emit('response', Responses.GAME_EXISTS);
    }
  });
  socket.on(Requests.JOIN_GAME, function (gameName) {
    var game = games.getGame(gameName);
    if (!game) {
      socket.emit('response', Responses.GAME_NOT_EXISTS);
    } else {
      if (game.addPlayer(socket)) {
        socket.emit('response', Responses.SUCCESS);
      } else {
        socket.emit('response', Responses.GAME_FULL);
      }
    }
  });
});
