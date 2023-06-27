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

- ping compensation
  - seems like we don't do anything
    - snapshots have osme sort of "time" indicator
    - how do we know what "now" is?
      - rely on ping (seems circular)
      - gauge by tick rate (ie when we receive a snapshot, we expect another one in 1000/tick millis) - use client time to fill in the blank
        - think of the client time as a "playhead" - we roughly expect our playhead to leave room for some number of future snapshots
        - if we have "more" snapshots than we expect then we accelerate things slightly
        - alt: estimate by (1 / ping?)
      - gauge by last snapshot received
        - some mention of this on the site
        - "true time" is (last snapshot) + client acc'd delta + render interp delay
        - "effective time" generally sticks with true time unless delta increases (ie lag)
          - else: lerp back towards "true time"
          - render from this time point

- reit on lag comp
  - client acts in "real time" ahead of snapshots
  - inputs arrive w ping delay, are acted out on the server, and are sent back in the form of the next snapshot
  - client receives their responses after ping delay (corresponding with "client time")
    - 

- is there a way we can solve the problem for our client, and for the server, with the same solution?
  - opt 1: maintain a completely separate snapshot which only contains the client, and do all the same math
    - concern: logic which interacts with server state - wouldn't necc. be accurate
  - opt 1.5: create a separate buffer which the client can make inputs on - server is calculating behavior in "real time", per-frame - we "clone" the world state here and perform operations on it
    - note: the server has to do like "checking" on the state to create its next snapshot (ie: we can't just "step forward" based on input data)
  - opt 2: patch input updates to our client only (ie as we input them) and use this in conjunction with snapshot updates
    - (snapshots will have client data in them - how to reconcile?)
      - clients write incomplete snapshot data to the "client frontier"
      - snapshots overwrite as they arrive
  - opt 3: ignore client in snapshots, handle completely separately
    - client logic is handled locally, inputs are broadcast
    - disagreement is handled manually
      - issue: lots of rewritten logic to get client to work fine!!!
  - opt 4: bind replay to tick rate
    - maintain a second "local" copy of the world
    - (trouble: how can we both advance and interpolate? right now server view is dependent on inputs)
  - opt 5: save this for later :3
    - come up with a cheap solution which we can expand on later
    - i'm thinking we can come up with one interface which exposes "game state" and then come up with more/less complicated implementations for that

  - i'm thinking this is way too overengineered right now
    - for ewn: netcode for clients is very simple 
      - player: do whenever you want to, the p2p server will get that command eventually
      - clients: send server packets, ignore client
      - similar ish logic problem (how do we fit the player's "now" motions into the past, with the same logic that the server uses to interpret its "present"? [given that the logic is mostly the same])
        - split apart into extrapolation step and interpolation step
        - we extrapolate everything for which input has not changed, and we advance everything for which input has changed
        - "interpolating" to a new tick is close enough to "extrapolating" to one (we could even handle them the same: extrapolate, then interpolate)
        - in that case: we separate into three parts
          - extrapolate (generate a destination frame)
          - update inputs (voiding anything which has an inputted delta, ie the player)
            - this step, we just pop in a pre-"extrapolated" (server provided) frame
          - interpolate/advance (everything behaving the same interpolates, everything behaving differently advances)
    - too much work: for EWN I'm thinking we just broadcast "input commands" which are picked up by the server "as they happen"
      - unlock from ticks, just pass along messages - enough for this because we don't care about clashes or simulation, just behavior!!!
      - i might need this lag comp code down the line though
  - for crossword
    - commands are handled as we receive them
      - possibly some "ping negotiation" but someone is going to get shortchanged
      - super duper simple i'm thinking - we just put up "board ticks" every once in a while (meaning we can use what I have now :)




