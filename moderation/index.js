const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type } = req.body;

  console.log("Received Event:", type);

  if (type === "CommentCreated") {
    const { data } = req.body;
    if (!data) {
      throw new Error("Data is required for CommentCreated event");
    }

    const { id, content, postId, status } = data;

    if (!id || !content || !postId || !status) {
      throw new Error(
        "id, content, postId and status are required in CommentCreated event data",
      );
    }
    console.log("Moderating comment:", content);
    const moderationStatus =
      content.includes("orange") || content.includes("fruit")
        ? "rejected"
        : "approved";
    console.log(`Moderation result for comment: ${moderationStatus}`);

    // delay to simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Should run after delay");

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id,
        postId,
        status: moderationStatus,
      },
    });
  }
  res.send({});
});

app.listen(4003, () => {
  console.log("Moderation Service listening on port 4003");
});
