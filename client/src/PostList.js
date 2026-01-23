import axios from "axios";
import React, { useState, useEffect } from "react";

const PostList = () => {
  const [posts, setPosts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = (await axios.get("http://localhost:4000/posts")).data;
      console.log("Fetched posts:", posts);
      setPosts(posts);
    };

    fetchPosts();
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostList;
