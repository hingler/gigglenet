import { DataConnection } from "peerjs";
import { CommandPacketImpl } from "../../CommandPacket";

/**
 * Handle representing an individual client
 */
export class ClientHandle {
  private conn: DataConnection;
  private _uuid: string

  get uuid() {
    return this._uuid
  }
  constructor(conn: DataConnection, uuid: string) {
    this.conn = conn;
    this._uuid = uuid;
  }

  /**
   * Sends a message to the relevant client
   * @param command - command to send
   * @param message - message we want to send
   */
  send(command: string, message: any) {
    // tba: optimize this?
    this.conn.send(new CommandPacketImpl(command, message));
  }
}