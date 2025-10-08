const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
app.use(bodyParser.json());
const port = 4000;

const posts = {};

app.get("/posts", (_, res) => {
  console.log("Get all posts");
  res.send(posts);
});

app.post("/posts", (req, res) => {
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
  res.status(201).send(posts[id]);
});

app.listen(port, () => {
  console.log(`Posts service listening on port ${port}`);
});
