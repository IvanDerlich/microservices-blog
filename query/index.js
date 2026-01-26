const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/events", (req, res) => {
  res.send("Event Bus is running");
});

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("Received Event:", event);

  res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Query service listening on port 4002");
});
