/**
 * Maps shorthand IDs to peerJS IDs
 */
export class PeerIDMapper {
  // - need to clear out occasionally (prob requires some LRU)
  // - clear out after inactivity (no LRU, just rely on a timeout?)
  private idMap: Map<string, string> = new Map();

  private _idLength: number;

  private static readonly CAPITAL_A: number = 65;

  constructor(idLength: number = 4) {
    this._idLength = idLength;
  }

  /**
   * Generates a shorthand ID for a given peer ID
   * @param peerId - peer ID we want to encode
   * @returns generated shorthand ID
   */
  registerId(peerId: string): string {
    let id = this.generateNewId();
    this.idMap.set(id, peerId);
    return id;
  }

  /**
   * Fetches the peer ID associated with a given shorthand ID
   * @param shortId - shorthand ID sent by client
   * @returns corresponding peer ID
   */
  getId(shortId: string): string {
    if (!this.idMap.has(shortId)) {
      return "";
    } else {
      return this.idMap.get(shortId);
    }
  }

  private generateNewId(): string {
    let id: string;
    do {
      let idArray = Array(this._idLength).fill(0).map(_ => Math.floor(Math.random() * 26) + PeerIDMapper.CAPITAL_A);
      id = String.fromCharCode.apply(String, idArray);
    } while (this.idMap.has(id));
    return id;
  }
}