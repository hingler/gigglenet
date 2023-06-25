// base impl for peer client

export type ClientCallback = (response: any) => void;
export type ConnectionCallback = () => void;

export interface P2PClient extends P2PNode<ClientCallback> {
  /**
   * Connects to a specified ID
   * @param destinationId - id which we wish to connect to
   * @param callback - callback which is called when we connect
   */
  connect(destinationId: string, callback: ConnectionCallback);
  
  /**
   * Sends specified message to server.
   * @param command - command name associated with message
   * @param message - message being sent
   */
  send(command: string, message: any);

  /**
   * closes current connection.
   */
  close();
}