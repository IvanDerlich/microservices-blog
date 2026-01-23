const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());

const port = 4001;

const commentsByPostId = {};

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/posts/:id/comments", (req, res) => {
  console.log("Get all comments for a post");
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  console.log("Create a comment for a post");

  const postId = req.params.id;

  if (!postId) {
    throw new Error("Post ID is required");
  }
  const comments = (commentsByPostId[postId] ||= []);

  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comment = { id: commentId, content };
  comments.push(comment);
  res.status(201).send(comment);
});

app.listen(port, () => {
  console.log(`Comments service listening on port ${port}`);
});
