import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  events.push(event);
  // axios.post('http://localhost:4000/events', event).catch((err) => {
  //   console.error('Error sending event to service 4000:', err.message);
  // });
  // axios.post('http://localhost:4001/events', event).catch((err) => {
  //   console.error('Error sending event to service 4001:', err.message);
  // });
  // axios.post('http://localhost:4002/events', event).catch((err) => {
  //   console.error('Error sending event to service 4002:', err.message);
  // });
  await Promise.all([
    axios.post("http://localhost:4000/events", event),
    axios.post("http://localhost:4001/events", event),
    axios.post("http://localhost:4002/events", event),
  ]).catch((err) => {
    // console.error("Error sending event to one of the services:", err.message);
    res.status(500);
    throw err;
  });

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Event Bus listening on port 4005");
});
