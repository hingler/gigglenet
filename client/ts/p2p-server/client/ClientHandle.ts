export interface ClientHandle {
  /**
   * @returns uuid associated with this client
   */
  get uuid(): string

  /**
   * Sends a message to this client
   * @param command - command to send
   * @param message - message data to send
   */
  send(command: string, message: any): void;
}