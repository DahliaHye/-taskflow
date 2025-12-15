import React, { useState, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewPostForm from "./NewPostForm";
import PostCard from "./PostCard";
import { useAuth } from "../context/AuthContext";
import Banner from "./Banner";

const Posts = memo(({ postService, userid, addable }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const history = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    postService
      .getPosts(userid)
      .then((posts) => setPosts([...posts]))
      .catch(onError);
  });

  const onCreated = (post) => {
    setPosts((posts) => [post, ...posts]);
  };
  const onDelete = (postId) =>
    postService
      .deletePost(postId)
      .then(() =>
        setPosts((posts) => posts.filter((post) => post._id !== postId))
      )
      .catch((error) => setError(error.toString()));

  const onUpdate = (postId, text) =>
    postService
      .updatePost(postId, text)
      .then((updated) =>
        setPosts((posts) =>
          posts.map((item) => (item._id === updated._id ? updated : item))
        )
      )
      .catch((error) => error.toString());

  const onUseridClick = (post) => history(`/${post.userid}`);
  const onError = (error) => {
    setError(error.toString());
    setTimeout(() => {
      setError("");
    }, 3000);
  };
  return (
    <>
      {addable && <NewPostForm postService={postService} onError={onError} />}
      {error && <Banner text={error} isAlert={true} />}
      {posts.length === 0 && (
        <p className="posts-empty">아직 포스트가 없습니다.</p>
      )}
      <ul className="posts">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            owner={post.userid === user.userid}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUseridClick={onUseridClick}
          />
        ))}
      </ul>
    </>
  );
});
export default Posts;
