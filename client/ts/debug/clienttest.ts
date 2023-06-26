// super simple static html page
// accept a peer ID and attempt to connect to it
import { P2PClient } from "../p2p-client/P2PClient";
import { P2PClientImpl } from "../p2p-client/impl/P2PClientImpl";

window.addEventListener("load", main);

let peer: P2PClient;

function main() {
  document.getElementById("connect").addEventListener("click", connect);
}

function connect(ev: MouseEvent) {
  let id = (document.getElementById("peer-id") as HTMLInputElement).value;
  console.log("connecting to peer ", id);
  peer = new P2PClientImpl();
  peer.connect(id, () => {
    console.log("the bluetooth device is connected successfully");
    peer.send("test", {
      field: "hello"
    });
  });

  
}