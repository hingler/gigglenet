# todo

## general

prob want to use socket io because i think they take care of a lot of it
- go for simplest possible implementation (tiny packets of data, server/client)
- ts: would be nice if we can attempt object casts (i'm thinking something like godot does with signals)
  - thinking: some sort of object factory - we can fudge things on the back end as long as it's seamless for user
  - possibly: custom factories driven by a "type string"


## server config
- would like to do it jackbox-ish:
  - server maps peerjs ids -> shorthand IDs (4 chars ideally)
  - user fetches full peerJS id from "game server" and maps to a peer ID
  - prob use some sort of "game filter" to ensure we're not accidentally connecting to the wrong thing, otherwise the game will break
  - (we cna use a namespace to accomplish somewhat with v5 - not a good way to hide if we're client gen'd but whatever)
    - tba: we could negotiate with server prior?? not gonna worry about it right now


## misc todos
- handle reconnect events gracefully
  - connect back to game if possible
- handle snapshots gracefully
  - ie some sort of server wrapper for a specific command
  - in lagcomp i think
  - provide a "receive input" command and a "send snapshot" command (server)
  - provide a "receive snapshot" and a "send input" command (client)
  - need to write two-sided unfortunately i think
    - input handler (modify moving forwards)
    - snapshot lerper (can be generic if we implement correctly)