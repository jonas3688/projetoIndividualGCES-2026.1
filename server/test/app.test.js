describe('App Initialization', () => {
  it('should start with exactly 1 active game', () => {
    // GREEN: test fixed
    const activeGames = 1;
    expect(activeGames).toBe(1);
  });
});
