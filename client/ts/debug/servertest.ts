import { P2PServerImpl } from "../p2p-server/impl/P2PServerImpl";

// display any messages we receive under some generic command
window.addEventListener("load", main);

function main() {
  let peer = new P2PServerImpl(new URL("http://localhost:8080/register-peer"));
  peer.listen("test", (client, response) => {
    console.log("received response from client under command 'test': ", response);
  })
}