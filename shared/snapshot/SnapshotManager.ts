export interface SnapshotManager<T> {
  /**
   * Need server and client logic
   * # server:
   *  - extrapolate based on current input state (ie generate a new snapshot)
   *  - respond to user input (potentially confirming events which happened sometime in the past)
   *    - propagating changes forward - some sort of "output adjustment" (ie extrapolating from a "known" input forwards)
   *    - possibly: truncating input changes to a "safe range"
   *      - multiplayer context: user receives shot in next "snapshot"
   *  - interpolate between states (ie we can just step back in our snapshot chain)
   * 
   * spec
   * - server end receives inputs and calculates next server snapshot
   * - client end receives snapshots and interpolates between snapshots
   * - snapshots support interpolation (between two snapshots)
   * - snapshots support extrapolation (from two snapshots, forwards)
   * - should also be able to generate based on input data (server side - i think we can figure this out)
   * - server should assume responsibility for advancing snapshot (we'll have to figure out how to interpret input contextually)
   * - with input prediction: what I don't get is how we're comparing the snapshot with our position, when our position is however far ahead of the snapshot (like ping + interp millis ahead right?)
   *    - best answer i see: we retain an "input history" and maintain a "snapshot history" for the player, in addition to the snapshot history maintained by the server.
   *    - we figure out where the server has us, and "replay" our inputs back up to the present
   *    - for client: the code ends up being the same as it is for the whole server
   * 
   * 
   */
}


