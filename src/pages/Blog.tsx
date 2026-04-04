import { Iblog } from "../components/Iblog";
import type { BlogProps } from "../components/Iblog";
import "../components/Iblog.css";
import blogData from "../assets/blog/blog.json";
import { useSearchParams } from "react-router";
import { useMemo } from "react";

const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const blogList = (blogData as BlogProps[])
  .filter((post) => post.publish === 1)
  .sort((a, b) => parseDate(b.date) - parseDate(a.date));

const ALL_TAGS = Array.from(
  new Set(blogList.flatMap((post) => post.tags))
).sort();

type FilterMode = "any" | "and";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = searchParams.getAll("tag");
  const rawMode = searchParams.get("mode");
  const filterMode: FilterMode = rawMode === "and" ? "and" : "any";

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    const params = new URLSearchParams();
    next.forEach((t) => params.append("tag", t));
    if (filterMode !== "any") params.set("mode", filterMode);
    setSearchParams(params);
  };

  const changeMode = (next: FilterMode) => {
    const params = new URLSearchParams();
    selectedTags.forEach((t) => params.append("tag", t));
    if (next !== "any") params.set("mode", next);
    setSearchParams(params);
  };

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return blogList;

    if (filterMode === "and") {
      return blogList.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      );
    }

    return blogList.filter((post) =>
      selectedTags.some((tag) => post.tags.includes(tag))
    );
  }, [selectedTags, filterMode]);

  return (
    <div className="blogouter">
      <div className="filters">
        <div className="filters__row">
          <div>
          <span className="filters__label">Tags:</span>
          {" "}
          <span className="filters__mode">
            <select
              id="tag-filter-mode"
              value={filterMode}
              onChange={(e) => changeMode(e.target.value as FilterMode)}
              className="filters__select"
            >
              <option value="any">Any</option>
              <option value="and">And</option>
            </select>
          </span>
          </div>
          <div className="tags">
            {ALL_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <span key={tag}>
                  <button
                    onClick={() => toggleTag(tag)}
                    className={`tag-pill ${active ? "tag-pill--active" : ""}`}
                  >
                    #{tag}
                  </button>{" "}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="blog-page__grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <Iblog key={`blog-${post.url || index}`} {...post} />
          ))
        ) : (
          <p className="blog-page__empty">No posts match the selected tags.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;