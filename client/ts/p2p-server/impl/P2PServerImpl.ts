import Peer, { DataConnection } from "peerjs";
import { P2PServer, ServerCallback } from "../P2PServer";
import { ClientHandle } from "../client/ClientHandle";
import { CommandBroadcaster } from "../../../../shared/CommandBroadcaster";
import { CommandPacket } from "../../CommandPacket";

import * as uuid from 'uuid';
import { GigglenetMetadata } from "../../../../shared/GigglenetMetadata";

export class P2PServerImpl implements P2PServer {
  private peer: Peer;
  private clientMap: Map<string, ClientHandle> = new Map();
  private commandBroadcaster: CommandBroadcaster<ServerCallback> = new CommandBroadcaster();

  get peerId() {
    return this.peer.id;
  }

  constructor() {
    this.peer = new Peer(null, {
      debug: 2
    });

    this.peer.on("open", (id: string) => {
      console.log("new id: ", id)
    });

    this.peer.on("connection", (conn: DataConnection) => {
      // tba: possible leak??
      this.configureConnection(conn);
    });
  }

  listen(command: string, callback: ServerCallback): void {
    this.commandBroadcaster.addListener(command, callback);
  }

  send(command: string, message: any): void {
    for (let handle of this.clientMap.values()) {
      handle.send(command, message);
    }
  }

  private configureConnection(conn: DataConnection) {
    let metadata = (conn.metadata as GigglenetMetadata);
    // validate uuid metadata
    if (metadata.uuid == null || !uuid.validate(metadata.uuid)) {
      console.warn("received invalid connection - closing...");
      setInterval(
        () => conn.close(),
        500
      );
    } else {
      console.log("received connection! uuid - ", metadata.uuid);
      let clientHandle = new ClientHandle(conn, metadata.uuid);
      this.clientMap.set(metadata.uuid, clientHandle);

      conn.on("open", () => {
        console.log("connected to peer :3");
      })

      conn.on("data", (data) => {
        console.log("received message from client ", conn, ": ", data);
        let packet = data as CommandPacket;
        let listeners = this.commandBroadcaster.getListeners(packet.command);
        if (listeners != null) {
          for (let listener of listeners) {
            listener(clientHandle, packet.message);
          }
        }
      });
    }
  }
}