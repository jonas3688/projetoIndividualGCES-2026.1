const { GameCollection } = require('../games');

describe('GameCollection', () => {
  let games;

  beforeEach(() => {
    games = new GameCollection();
  });

  it('should create a new game and return true', () => {
    const result = games.createGame('test-room');
    expect(result).toBe(true);
  });

  it('should not create a duplicate game', () => {
    games.createGame('room-1');
    const result = games.createGame('room-1');
    expect(result).toBe(false);
  });

  it('should retrieve an existing game by name', () => {
    games.createGame('room-x');
    const game = games.getGame('room-x');
    expect(game).toBeDefined();
    expect(game.getId()).toBe('room-x');
  });

  it('should return undefined for a non-existent game', () => {
    const game = games.getGame('no-such-room');
    expect(game).toBeUndefined();
  });

  it('should remove an existing game and return true', () => {
    games.createGame('to-remove');
    const result = games.removeGame('to-remove');
    expect(result).toBe(true);
    expect(games.getGame('to-remove')).toBeUndefined();
  });

  it('should return false when removing a non-existent game', () => {
    const result = games.removeGame('ghost');
    expect(result).toBe(false);
  });
});
