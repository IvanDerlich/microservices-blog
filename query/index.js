const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
      break;
    }
    case "CommentCreated": {
      const { id, postId } = data;
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
};

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
  const { type, data } = req.body;
  console.log("Received Event Type:", type);
  console.log("Received Event Data:", data);
  handleEvent(type, data);
  res.send({ status: "OK" });
});

app.listen(4002, async () => {
  console.log("Query service listening on port 4002");
  try {
    const res = await axios.get("http://localhost:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
