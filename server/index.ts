import * as express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("client/static"));
const server = app.listen(port, () => {
  console.log("server is up");
});