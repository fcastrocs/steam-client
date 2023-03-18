export default interface IPlayer {
  getOwnedGames(steamid: Long, options: { appidsFilter?: number[]; includePlayedFreeGames: boolean });
}
