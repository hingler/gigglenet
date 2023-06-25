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

    // tba: broadcast ID to server side, in order to permit clients to connect
    // server needs some sort of "get peer ID" command to get the "actual" id
    // we'll then connect client with that

    // some niceties:
    // - events for establishing a connection
    // - trigger conn on user function call instead of handling in ctor
    //    - related: configure conn later
    // - the rest i think we're fine on

    // later later on:
    // - need some reliable way to reconnect
    //    - thinking: gen a guid on connection and send to client, client can reconn with that guid
    //    - alt: 

    this.peer.on("open", (id: string) => {
      console.log("new id: ", id)
    });

    this.peer.on("connection", (conn: DataConnection) => {
      // tba: possible leak??
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
    })
  }

  listen(command: string, callback: ServerCallback): void {
    this.commandBroadcaster.addListener(command, callback);
  }

}