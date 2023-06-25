import Peer, { DataConnection } from 'peerjs';
import { ClientCallback, ConnectionCallback, P2PClient } from '../P2PClient';
import { CommandBroadcaster } from '../../../../shared/CommandBroadcaster';
import { CommandPacket, CommandPacketImpl } from '../../CommandPacket';

import * as uuid from 'uuid';

export class P2PClientImpl implements P2PClient {
  private peer: Peer;
  private conn: DataConnection;
  private commandBroadcaster: CommandBroadcaster<ClientCallback> = new CommandBroadcaster();
  // list of commands not yet sent
  private commandQueue: Set<CommandPacket>;

  // id we wish to connect to
  private _destinationId: string;
  // called when connection succeeds
  private _connectCallback: ConnectionCallback | null;

  constructor() {
    this.commandQueue = new Set();

    let tempPeer = new Peer(null, {
      debug: 2
    });

    tempPeer.on("open", (id: string) => {
      this.peer = tempPeer;
      this.configurePeer(tempPeer);
    });

    tempPeer.on("connection", (conn: DataConnection) => {
      console.warn("client attempted to connect to local, disconnecting...");
      setInterval(() => conn.close(), 500);
    })

    tempPeer.on("error", (error) => {
      console.log("peer encountered error: ", error);
    });

  }

  connect(destinationId: string, callback?: ConnectionCallback) {
    this._destinationId = destinationId;
    this._connectCallback = callback;
    if (this.peer == null) {
      console.debug("peer not yet open - will connect once open");
    } else {
      this.close();
      this.configureConnection(this._destinationId);
    }

  }

  send(command: string, message: any) {
    let packet = new CommandPacketImpl(command, message);
    if (this.conn == null) {
      console.log("delaying send as connection is still null");
      this.commandQueue.add(packet);
    } else {
      this.conn.send(new CommandPacketImpl(command, message));
    }
  }

  listen(command: string, callback: (response: any) => void): void {
    this.commandBroadcaster.addListener(command, callback);
  }

  close() {
    // tba: close call while connecting?
    //  - create bool flag
    if (this.conn != null) {
      this.conn.close();
    }

    this.conn = null;
  }

  // peer connected successfully - configure for new connection
  private configurePeer(peer: Peer) {
    console.debug("peer configured - able to connect now");

    if (this._destinationId != null) {
      // attempt to connect
      this.connect(this._destinationId, this._connectCallback);
    }
  }

  // creates connection to specified ID
  private configureConnection(id: string) {
    console.log("configuring connection...");
    let tempConn = this.peer.connect(id, {
      reliable: true,
      metadata: {
        uuid: uuid.v4()
      }
    });

    tempConn.on("error", (error) => {
      console.log("received error: ", error);
    });

    tempConn.on("open", () => {
      // pass to object + handle
      this.conn = tempConn;
      if (this._connectCallback != null) {
        this._connectCallback();
      }

      console.log("conn is open, sending waiting commands");
      for (let p of this.commandQueue) {
        this.conn.send(p);
      }

      this.commandQueue.clear();

      tempConn.on("data", (data) => {
        console.log("client: received message from server");
        let packet = data as CommandPacket;
        let listeners = this.commandBroadcaster.getListeners(packet.command);
        if (listeners != null) {
          for (let listener of listeners) {
            listener(packet.message);
          }
        }
      })
    })
  }
}