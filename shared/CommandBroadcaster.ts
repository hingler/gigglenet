/**
 * Registers listeners under commands and delegates received commands
 * to relevant listeners
 */

export class CommandBroadcaster<CallbackType> {
  private commandMap: Map<string, Set<CallbackType>> = new Map();

  addListener(command: string, listener: CallbackType) {
    if (!this.commandMap.get(command)) {
      this.commandMap.set(command, new Set());
    }

    this.commandMap.get(command).add(listener);
  }

  removeListener(command: string, listener: CallbackType) {
    let listenerSet = this.commandMap.get(command);
    if (listenerSet) {
      listenerSet.delete(listener);
    }
  }

  getListeners(command: string): ReadonlySet<CallbackType> | null {
    return this.commandMap.get(command);
  }
}