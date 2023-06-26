// base impl for peer server

import { ClientHandle } from "./client/ClientHandle";

/**
 * @param client - object representing client which sends message
 * @param response - object representing response from client
 */
export type ClientObject = ClientHandle;
export type ServerCallback = (client: ClientObject, response: any) => void;

export interface P2PServer extends P2PNode<ServerCallback> {
  /**
   * Sends message to all clients.
   * @param command - command to send
   * @param message - message we want to send
   */
  send(command: string, message: any): void;
}