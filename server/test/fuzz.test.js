const { GameCollection } = require('../games');

describe('Fuzz Testing - GameCollection', () => {
  let games;

  beforeEach(() => {
    games = new GameCollection();
  });

  it('should handle extremely long game names', () => {
    const longName = 'a'.repeat(10000);
    const result = games.createGame(longName);
    expect(result).toBe(true);
    expect(games.getGame(longName)).toBeDefined();
  });

  it('should handle empty string as game name', () => {
    const result = games.createGame('');
    expect(result).toBe(true);
    expect(games.getGame('')).toBeDefined();
  });

  it('should handle special characters in game names', () => {
    const specials = ['<script>alert(1)</script>', '../../etc/passwd', 'null', 'undefined', '0', '\x00\x01\x02'];
    specials.forEach(name => {
      expect(() => games.createGame(name)).not.toThrow();
    });
  });

  it('should handle unicode and emoji game names', () => {
    const names = ['🎮🕹️', '日本語テスト', 'مرحبا', '   ', '\t\n'];
    names.forEach(name => {
      expect(() => games.createGame(name)).not.toThrow();
    });
  });

  it('should handle rapid sequential creates and removes', () => {
    for (let i = 0; i < 1000; i++) {
      const name = `fuzz-${i}-${Math.random().toString(36)}`;
      games.createGame(name);
      games.removeGame(name);
    }
    // No crash means success
    expect(true).toBe(true);
  });

  it('should handle numeric and boolean-like game names', () => {
    [0, 1, -1, true, false, NaN, Infinity, null].forEach(val => {
      expect(() => games.createGame(String(val))).not.toThrow();
    });
  });

  it('should not crash when removing games that were never created', () => {
    for (let i = 0; i < 100; i++) {
      expect(() => games.removeGame(`nonexistent-${Math.random()}`)).not.toThrow();
    }
  });
});
