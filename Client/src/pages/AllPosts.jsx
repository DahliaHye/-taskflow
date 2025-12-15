import React from "react";
import Posts from "../components/Posts";

const AllPost = ({ postService }) => (
  <Posts postService={postService} addable={true} />
);

export default AllPost;
