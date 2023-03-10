export default interface IPlayer {
  getOwnedGames(steamid: Long, appidsFilter?: number[]): Promise<Game[]>;
}
