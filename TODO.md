# todo

## general

prob want to use socket io because i think they take care of a lot of it
- go for simplest possible implementation (tiny packets of data, server/client)
- ts: would be nice if we can attempt object casts (i'm thinking something like godot does with signals)
  - thinking: some sort of object factory - we can fudge things on the back end as long as it's seamless for user
  - possibly: custom factories driven by a "type string"


trying peer js to help with the intricacies for now :3

## server
- setup looks simple
- wow peer even handles the signaling server (i guess it might just be cheap to keep up??)
- idea right now:
  - server connects, and receives ID
  - we can probably tell the "game service" which ID we got (or use it 1:1, or map it :o)
  - do we want to handle game logic? i think that separate
- our idea is just that we want some method for wrapping "arbitrary data"
  - how "low level" should it be? the library takes care of a lot
  - q: "what would I personally need, to do everything I want to do?"
    - definitely not video streaming
    - json objects would help a lot
      - how about: "compression" -> "decompression" schemata?
      - nvm - peerjs handles it :3
      - we can start to get more "custom" with the event data :o


## engineering
- how much work should the wrapper be doing
  - specifically designed for the "jackbox" type game setups
  - at some point i had the idea that we would focus on "game snapshots" and that would help resolve things (possibly makes sense? not suited for every idea though)
  - there were a couple ideas on the back burner which would benefit from this (cw, show)
  - a couple which wouldn't (meme, jb)
  - could try to "please everyone"
  - could also write a separate "client/server" thing which we could feed updates to
  - i think we just keep it super simple for now, we probably don't even need lag comp >:D
    - (might be good to write a basic "lag comp" setup though)
- type consumption
  - we definitely need some type of "factory" to convert json/binary data to type info
  - can't depend on interfaces to infer type info - factory w endpoints???
  - idea1: append some sort of "type hint" which a factory will be responsible for parsing
  - idea2: use "type hints" in the place of proper typing
    - use some factory to pick up and propagate


## some misc notes
- local connection and remote connection are both peer connection objects