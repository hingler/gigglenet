# lag compensation
- (assuming we want to go this route at all lol)
- thinking: we would have a singular "front facing" implementation which supports the following
  - lerp - lerps to a specified "tick" value based on stored bytes (mostly client i think)
  - update - receives a user packet w an attached "time" + "action data" and resolves the underlying server state (thinking: subtick would be easy w this???)
  - snap - gets a snapshot at the current time in whatever arbitrary format we want (should attach a timecode to it too)
- spec
  - our "snapshot" has to implement the above
  - it has to consume user packets as arb data (because i don't want to deal w templating that out)
- i think it's something we *could* take care of, might be a good "incremental goal" (ie do something simpler first like a better gif game)

- snapshot logic
  - peer/client should be separately responsible for parsing snapshot (alt: we build it into the library? but we still need logic to parse inputs anyway so seems pointless)
  - natural implementation then seems to be pipelining particular (ie lag comped) commands to separate handling
    - implement as interceptor
    - handle per command (a la express???)
    - thinking: we add pipelines for types of info
    - (also: later)


- for EWN: how much do we need?
  - lag comp is a bit overengineered - we don't need to "retcon" anything ig
    - what would we need it for?
      - sfx, accurate player movement 
        - could trust user, or could just delay every input - both of these seem shitty, but then again the rooms are full of trusted individuals
        - proper "lag comp" would make things generally line up for everyone (easier to recreate shit)
        - put a higher lerp, lower tick rate on viewers (like 1s delay) and i think everything would work fine!
        - proper ticks might save us a bit on the final implementation

      - collisions don't matter so reconstruction logic is pretty simple

