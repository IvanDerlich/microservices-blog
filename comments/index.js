const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const app = express();
app.use(bodyParser.json());

const port = 4001;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  console.log("Get all comments for a post");
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  console.log("Create a comment for a post");
  let commentId;
  const postId = req.params.id;
  if (!postId) {
    throw new Error("Post ID is required");
  }

  if (!commentsByPostId[postId]) {
    commentsByPostId[postId] = [];
  }

  do {
    commentId = randomBytes(4).toString("hex");
  } while (commentsByPostId[postId][commentId]);
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[postId] = comments;
  res.status(201).send(commentsByPostId[postId][commentId]);
});

app.listen(port, () => {
  console.log(`Comments service listening on port ${port}`);
});
