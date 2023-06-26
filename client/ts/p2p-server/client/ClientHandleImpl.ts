import { DataConnection } from "peerjs";
import { CommandPacketImpl } from "../../CommandPacket";

/**
 * Handle representing an individual client
 */
export class ClientHandleImpl {
  private conn: DataConnection;
  private _uuid: string

  get uuid() {
    return this._uuid
  }
  constructor(conn: DataConnection, uuid: string) {
    this.conn = conn;
    this._uuid = uuid;
  }

  send(command: string, message: any) {
    // tba: optimize this?
    this.conn.send(new CommandPacketImpl(command, message));
  }

  /**
   * Updates the connection associated with this client handle, ex. in the event of a disconnect
   * @param conn - new connection associated with this client
   */
  updateConnection(conn: DataConnection) {
    if (this.conn != null) {
      this.conn.close();
    }

    this.conn = conn;
  }
}