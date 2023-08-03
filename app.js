const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const io = new Server(server);
const axios = require("axios");
require("dotenv").config();

const FINAGE_API_KEY = process.env.FINAGE_API_KEY;
const symbol = "BTCUSD";

app.use("/", express.static(path.join(__dirname, "public")));

setInterval(async () => {
  var request = await axios.get(
    "https://api.finage.co.uk/last/crypto/" +
      symbol +
      "?apikey=" +
      FINAGE_API_KEY
  );
  io.emit("priceupdate", request.data.price);
}, 1000);

async function getHistoricalData() {
  var request = await axios.get(
    "https://api.finage.co.uk/agg/crypto/" +
      symbol +
      "/1/minute/2023-06-29/2023-06-29?apikey=" +
      FINAGE_API_KEY +
      "&limit=20&sort=asc"
  );

  var result = request.data.results;
  return result;
}

io.on("connection", async (socket) => {
  const historicalData = await getHistoricalData();
  socket.emit("historical", historicalData);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
