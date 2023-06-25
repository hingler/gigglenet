# factory problem

issue right now: we need to figure out how to spread out messages from our single "communication point" into bits which can be handled

necessitates some factory to transform agnostic messages into something meaningful, but that's not the most straightforward thing to do

## type hint

- sendable messages implement some sort of type hint on the interface itself (ie as an abstract class probably)
- we check for that type hint when parsing messages (in json, probably)
- (for binary data: we can implement a similar sort of "hint")
- (feeling like we just go with this for now)
- for factory: i think we can just register the types themselves? ("abstract static" is the wrong term - but we want the class to exist on the instance, and also on the static)
- note2: we're going to need a factory on the implementation itself to convert from nondiff'd json object to abstract impl (at that point)

## factory wrap

- factory wrap handles parsing to/from json object
- again: we return some sort of interface with a type hint, which the factory can read
- implement: 
  - fromJson(jsonObject) -> [template]
  - toJson(template) -> [sendable]
- for optional binary support?
  - (opt: fromBinary)
  - (opt: toBinary)

- write end
  - just provide an undifferentiated object
  - sender will map to respective factory, and convert to json

- read end
  - receive json
  - pass through factories list (quick reject if signature doesn't match)
  - thinking we can register listeners to handle specific abstract classes?
    - type -> factories (not sure how to detect templated class though)
    - interface coercion - registerListener(SomeType, Listener\<SomeType\>)
      - q: how to handle interfaces in that case?
      - we just have to implement what the factory implements (but that has to be an abstract since we can't really pass around interfaces as concrete types)
      - oh duh - just make the root class an abstract to guarantee abstract behavior
      - weighty type hierarchy but we're relying on type hierarchy to do this stuff anyway so np np

- how to get desired "abstract" type vs concrete implementation?
  - checking object type won't work as we only get the lowest type
  - ideally: we'd pick it up from template
  - abstract, use crtp to return type :O (i think we do this)

- type checking doesn't really work, we don't exactly get type info in js
  - how can we do this sort of "server dispatch" in ts/js?

## "plugins"

- alt: is there a simpler way to solve this problem?
  - could delegate responsibility to "plugins" which then dispatch parsed events to listeners
    - would make a "plugin" for each type we want to handle
    - incoming data dispatches to "plugins" which take care of transforming and broadcasting data
    - could rely on a sendable-like "typing" solution to handle the rest
  - i'm gonna go with this for now

- types required
  - "plugin"
    - factory-ish - handles input/output for a specific data type

## "express-like"

- callback function registers with a keyword, and receives json/binary data
- callback assumes responsibility for parsing type info and passing down the chain
- typecheck -> "keywords"

### benefits

- no need bothering with alternative typing schemes
- works for both server and client (intercommunication!)
