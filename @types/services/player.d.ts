declare class Player {
  constructor(steam: Steam);
  getOwnedGames(options?: {
    appidsFilter?: number[];
    includePlayedFreeGames?: boolean;
  }): Promise<Game[]>;
}

export default Player;
