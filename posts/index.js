const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());
const port = 4000;

const posts = {};

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/posts", (_, res) => {
  console.log("Get all posts");
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  console.log("Create a post");

  let id;
  do {
    id = randomBytes(4).toString("hex");
  } while (posts[id]);

  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event:", req.body.type);

  res.send({});
});

app.listen(port, () => {
  console.log(`Posts service listening on port ${port}`);
});
