import axios from "axios";
import React, { useState, useEffect } from "react";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchPostsWithComments = async () => {
      const posts = await axios.get("http://localhost:4002/posts");
      setPosts(posts.data);
    };
    fetchPostsWithComments();
  }, []);

  return (
    <>
      <h1>Post List</h1>
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {Object.values(posts).map((post) => (
          <div
            key={post.id}
            className="card"
            style={{ width: "30%", marginBottom: "20px" }}
          >
            <div className="card-body">
              <h3>{post.title}</h3>
              <CommentCreate postId={post.id} />
              <CommentList comments={post.comments} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
