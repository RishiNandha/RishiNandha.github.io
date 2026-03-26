import "./Iblog.css";
import { Link } from "react-router-dom";

export type BlogProps = {
  url_filename: string;
  title: string;
  publish: 0 | 1;
  thumbnail: string;
  tags: string[];
  date: string;
  description: string;
  related: string[];
};

export function Iblog(props: BlogProps) {
  const dateISO = new Date(props.date.split("/").reverse().join("-"));

  return (
    <div className="blog-card">

        <div className="blog-card__thumbnail">
          <img src={`../../public/blogs/thumbnails/${props.thumbnail}`} alt={props.title} />
        </div>

        <div className="blog-card__body">

            <div className="blog-card__title-row">
            <Link
                to={`/blog/${props.url_filename}`}
                className="blog-card__title-link"
                aria-label={`Read blog post: ${props.title}`}>
                <h2 className="blog-card__title">{props.title}↗</h2>
            </Link>
            </div>

            <div className="blog-card__meta">
                {props.tags.map((tag) => (
                <span><span key={tag} className="blog-card__tag">
                    #{tag}
                </span>{"  "}</span>))}
                <span className="blog-card__meta-icon" aria-hidden="true">
                    📅
                </span>
                <time className="blog-card__date" dateTime={dateISO.toISOString()}>
                    {props.date}
                </time>
            </div>

            <div>
                <p className="blog-card__description">{props.description}</p>
            </div>

        </div>

    </div>
  );
}