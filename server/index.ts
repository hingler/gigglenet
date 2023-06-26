import * as express from "express";
import { PeerIDMapper } from "./id/PeerIDMapper";
import { CommandConsts } from "../shared/CommandConsts";

const app = express();
const port = process.env.PORT || 8080;

const idMap = new PeerIDMapper(4);

let peerid: string = "";

app.post("/register-peer", (req, res) => {
  let id = req.query[CommandConsts.PEER_ID_QUERY_KEY].toString();
  console.log("peer id: ", id);
  peerid = id;
  res.send("ASDF");
});

app.get("/get-peer", (req, res) => {
  let id = req.query[CommandConsts.ID_QUERY_KEY].toString();
  console.log("id: ", id);
  if (id === "ASDF") {
    res.send(peerid);
  } else {
    res.send("000");
  }
})

app.use(express.static("client/static"));
const server = app.listen(port, () => {
  console.log("server is up");
});