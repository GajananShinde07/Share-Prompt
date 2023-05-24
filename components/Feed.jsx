"use client";
import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [filteredPost, setFilteredPost] = useState([]);

  const handleSearchChange = (event) => {
    let text = event.target.value.toLowerCase();

    setSearchText(event.target.value);

    const filterPost = posts.filter((eachPost) => {
      let prompt = eachPost.prompt;
      let tag = eachPost.tag;

      if (
        prompt.toLowerCase().includes(text) ||
        tag.toLowerCase().includes(text)
      )
        return eachPost;
    });

    setFilteredPost(filterPost);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setFilteredPost(data);
    };
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full felx-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList data={filteredPost} handleTagClick={() => {}} />
    </section>
  );
};

export default Feed;
