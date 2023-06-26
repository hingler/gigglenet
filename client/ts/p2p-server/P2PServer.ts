// base impl for peer server

import { ClientHandle } from "./client/ClientHandleImpl";

/**
 * @param client - object representing client which sends message
 * @param response - object representing response from client
 */
export type ClientObject = ClientHandle;
export type ServerCallback = (client: ClientObject, response: any) => void;

export interface P2PServer extends P2PNode<ServerCallback> {
  /**
   * 
   */
  get peerId(): string
  /**
   * Sends message to all clients.
   * @param command - command to send
   * @param message - message we want to send
   */
  send(command: string, message: any): void;
  
  /**
   * @returns shortened ID, if available - otherwise null
   */
  getShortenedId(): string | null;

  /**
   * @returns a promise which will eventually resolve to the shortened ID
   */
  getShortenedIdAsync(): Promise<string>;
}