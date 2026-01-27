const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
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
  const { content: receivedContent } = req.body;
  const comment = {
    id: commentId,
    content: receivedContent,
    status: "pending",
  };
  comments.push(comment);

  // Destructute the comment to prepare data to send
  const { id, content, status } = comment;

  axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id,
      content,
      status,
      postId,
    },
  });

  res.status(201).send(comment);
});

app.post("/events", (req, res) => {
  console.log("Received Event:", req.body.type);

  switch (req.body.type) {
    case "CommentModerated": {
      const { id, postId, status } = req.body.data;

      if (!id || !postId || !status) {
        throw new Error(
          "id, postId, and status are required in CommentModerated event data",
        );
      }

      const post = commentsByPostId[postId];
      if (!post) {
        throw new Error("Post not found for CommentModerated event: " + postId);
      }
      const comment = post.find((comment) => comment.id === id);
      if (!comment) {
        throw new Error("Comment not found for CommentModerated event: " + id);
      }

      comment.status = status;

      console.log("Updating moderated comment to:", comment);

      axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          postId,
          status,
          content: comment.content,
        },
      });
      break;
    }
    default:
      break;
  }

  res.send({});
});

app.listen(port, () => {
  console.log(`Comments service listening on port ${port}`);
});
