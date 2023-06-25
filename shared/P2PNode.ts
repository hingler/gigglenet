// common implementation for P2P read/write nodes
// NOT restful - call/response
// server needs to know clients, so that requires some additional information

interface P2PNode<CallbackType> {
  /**
   * Registers a listener which receives the relevant command
   * @param command - relevant command to listen for
   * @param callback - callback which receives command on response
   */
  listen(command: string, callback: CallbackType): void;
}