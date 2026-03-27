import "./Iactivism.css";
import ReactMarkdown from "react-markdown";

export type ActivismLinkObj = {
  link: string;
  annotation: string;
};

export type ActivismProps = {
  title: string;
  publish: 0 | 1;
  thumbnail: string;
  date: string;
  links: ActivismLinkObj[];
  description: string;
};

const activismImages = import.meta.glob(
  "/src/assets/activism/thumbnails/*",
  {
    eager: true,
    import: "default",
  }
) as Record<string, string>;


function resolveLink(link: string) {
  if (!link) return "#";

  // external links
  if (link.startsWith("http://") || link.startsWith("https://")) {
    return link;
  }

  // already absolute (e.g. /images/...)
  if (link.startsWith("/")) {
    return link;
  }

  // treat as public folder file
  return `/${link}`;
}

export function Iactivism(props: ActivismProps) {
  const imageSrc =
    activismImages[`/src/assets/activism/thumbnails/${props.thumbnail}`];

  return (
    <div className="oneunit activism-unit">
      <div className="left">
        <h2 className="project-title activism-title">{props.title}</h2>
        <p className="activism-date">📅 {props.date}</p>
      </div>

      <div className="project-card activism-card">
        <div className="project-left activism-left">
          <div className="image-wrapper activism-image-wrapper">
            <img
              src={imageSrc}
              alt={`Image showing ${props.title}`}
            />
          </div>
        </div>

        <div className="project-right activism-right">
          <div className="project-description activism-description">
          <ReactMarkdown>
            {props.description}
          </ReactMarkdown></div>

          <div className="project-links activism-links">
            {props.links.map((item, index) => (
<a
  key={index}
  className="project-link"
  href={resolveLink(item.link)}
  target={item.link.startsWith("http") ? "_blank" : "_self"}
  rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
>
  {item.annotation}
</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}