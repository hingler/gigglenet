import { CommandConsts } from "../../../../shared/CommandConsts";
import { P2PServer } from "../P2PServer";

export async function registerPeerId(
  server: P2PServer,
  endpoint: URL
): Promise<string> {
  // pump to post request
  // ... but need to be able to access the peer ID in some way
  // - expose as a promise and as a field
  // - if field not available, then we can rely on the promise to populate it :)
  // - will resolve right away if available
  
  // note: how to deal with the fact that peer ID won't be available right away?
  //    - call internally, once the peer is open
  //    - resolve the promise once this call completes
  //    - i don't like that resolve/reject are pushed out

  // expose as a callback (probably easier)
  //    - trouble: we have to register a bunch of callbacks :/ (promise would handle it nicer)
  //    - trouble2: callbacks linger when we don't need them (actually, probably not!)
  //    - gonna go with callback for now (so i don't over think it)
  //    - for a jackbox clone, callback will populate ID on UI (all we need)
  return postPeerId(server.peerId, endpoint);


}

async function postPeerId(peerId: string, endpoint: URL) {
  let queryEndpoint = new URL(endpoint);
  queryEndpoint.search = `${CommandConsts.PEER_ID_QUERY_KEY}=${peerId}`;
  console.log(queryEndpoint, queryEndpoint.toString());
  let res = await fetch(queryEndpoint, {
    method: "post"
  })

  return await res.text();
}