import Post from "../Post";
import { useEffect, useState } from "react";
import './openingPage.css'

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/post").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <div>
      <div className="my-8">
        <p className="exploreHead">Explore</p>
      </div>
      <div>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</div>
    </div>
  );
}
