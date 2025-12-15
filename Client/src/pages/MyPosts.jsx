import  React from "react";
import { useParams } from "react-router-dom";
import Posts from "../components/Posts"; 

const MyPosts = ({postService}) => {
    const {userid} = useParams(); 
    return <Posts postService={postService} userid={userid} addable={false} />;
}; 

export default MyPosts; 