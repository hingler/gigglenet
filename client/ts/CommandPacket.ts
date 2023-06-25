export interface CommandPacket {
  // command associated with this packet
  readonly command: string

  // message being sent
  readonly message: any
}

export class CommandPacketImpl implements CommandPacket {
  command: string;
  message: any;

  constructor(command: string, message: any) {
    this.command = command;
    this.message = message;
  }
}