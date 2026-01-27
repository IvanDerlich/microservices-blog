import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("Received Event:", event);

  events.push(event);

  const services = [
    "http://localhost:4000/events", // posts service
    "http://localhost:4001/events", // comments service
    "http://localhost:4002/events", // query service
    "http://localhost:4003/events", // moderation service
  ];

  await Promise.all(
    services.map((service) =>
      axios.post(service, event).catch((err) => {
        console.warn("Service not available:", service, err.message);
      }),
    ),
  );

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Event Bus listening on port 4005");
});
