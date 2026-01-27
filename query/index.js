const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const posts = {};

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("Received Event:", event);
  switch (event.type) {
    case "PostCreated": {
      const { id, title } = event.data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case "CommentCreated": {
      const { id, postId } = event.data;
      const post = posts[postId];
      if (!post) {
        const message = "Post not found for CommentCreated event: " + postId;
        console.error(message);
        res.status(400).send({
          error: message,
        });
        return;
      }
      post.comments.push({
        id,
        content: "Comment pending moderation",
      });
      break;
    }
    case "CommentUpdated": {
      const { id, postId, status, content } = event.data;
      const post = posts[postId];

      if (!post) {
        const message = "Post not found for CommentUpdated event: " + postId;
        console.error(message);
        res.status(400).send({
          error: message,
        });
        return;
      }
      const comment = post.comments.find((comment) => comment.id === id);
      if (!comment) {
        const message = "Comment not found for CommentUpdated event: " + id;
        console.error(message);
        res.status(400).send({
          error: message,
        });
        return;
      }
      switch (status) {
        case "approved":
          comment.content = content;
          break;
        case "rejected":
          comment.content = "Comment rejected";
          break;
        case "pending":
          throw new Error("Pending status should not update comment content");
        default:
          throw new Error("Unknown status: " + status);
      }
      console.log("Updated comment:", comment);
      break;
    }
    default:
      break;
  }

  res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Query service listening on port 4002");
});
