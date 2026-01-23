import React from "react";
import axios from "axios";

const CommentCreate = ({ postId }) => {
  const [comment, setComment] = React.useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Create a comment for post ID:", postId);
    console.log("Comment content:", comment);
    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content: comment,
    });
    setComment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor={`content-${postId}`}>New Comment</label>
          <input
            type="text"
            className="form-control"
            id={`content-${postId}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CommentCreate;
