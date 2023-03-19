declare class Player {
  getOwnedGames(steamid: Long, options: { appidsFilter?: number[]; includePlayedFreeGames: boolean });
}

export default Player;
