import Peer, { DataConnection } from "peerjs";
import { P2PServer, ServerCallback } from "../P2PServer";
import { ClientHandleImpl } from "../client/ClientHandleImpl";
import { CommandBroadcaster } from "../../../../shared/CommandBroadcaster";
import { CommandPacket } from "../../CommandPacket";

import * as uuid from 'uuid';
import { GigglenetMetadata } from "../../../../shared/GigglenetMetadata";
import { AsyncPromise } from "../../../../shared/promise/AsyncPromise";
import { registerPeerId } from "./registerPeerId";
import { ClientHandle } from "../client/ClientHandle";

export class P2PServerImpl implements P2PServer {
  private peer: Peer;
  private clientMap: Map<string, ClientHandleImpl> = new Map();
  private commandBroadcaster: CommandBroadcaster<ServerCallback> = new CommandBroadcaster();
  private shortId: AsyncPromise<string> = new AsyncPromise();

  get peerId(): string {
    return this.peer.id;
  }

  constructor(endpoint: URL) {
    this.peer = new Peer(null, {
      debug: 2
    });

    this.peer.on("open", (id: string) => {
      console.log("new id: ", id)
      if (endpoint != null) {
        registerPeerId(this, endpoint).then((id: string) => {
          this.shortId.resolve(id);
          console.log("short id: ", id);
        })
      } else {
        this.shortId.reject("no shortid available");
      }
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

  getShortenedId(): string | null {
    return this.shortId.get();
  }

  getShortenedIdAsync(): Promise<string> {
    return this.shortId.promise();
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
      let clientHandle: ClientHandleImpl;
      // not secure - there should be a solution to generate "server-side" but i'm not sure how to do that
      console.log("received connection! uuid - ", metadata.uuid);
      if (this.clientMap.has(metadata.uuid)) {
        clientHandle = this.clientMap.get(metadata.uuid);
        clientHandle.updateConnection(conn);
      } else {
        clientHandle = new ClientHandleImpl(conn, metadata.uuid);
        this.clientMap.set(metadata.uuid, clientHandle);
      }

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