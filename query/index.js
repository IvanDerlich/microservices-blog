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
      const { id, content, postId } = event.data;
      const post = posts[postId];
      if (post) {
        console.log("Adding comment to post:", postId);
        post.comments.push({ id, content });
      } else {
        console.error("Post not found for CommentCreated event:", postId);
        res.status(400).send({
          error: "Post not found for CommentCreated event: " + postId,
        });
        return;
      }
      break;
    }
    default:
      res.status(400).send({ error: "Unknown event type: " + event.type });
      return;
  }
  console.log("Updated Posts:", posts);

  res.send({ status: "OK" });
});

app.listen(4002, () => {
  console.log("Query service listening on port 4002");
});
