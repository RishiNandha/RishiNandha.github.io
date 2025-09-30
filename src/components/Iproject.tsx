import "./Iproject.css"

export type LinkObj = {
  link: string;
  annotation: string;
};

export type ProjProps = {
  title: string;
  imageSrc: string;
  description: string;
  links: LinkObj[];
  year: number;
  type: "research" | "other"
};


export function Iproject(props: ProjProps) {
    const currentYear = new Date().getFullYear();
    const yearLabel = props.year > currentYear ? `Ongoing` : props.year;
    
    return (
    <div className="oneunit">
    <div className="left">
        <h2 className="project-title">{props.title} ({yearLabel})</h2>
    </div>
    <div className="project-card">
      <div className="project-left">
            
            <div className="image-wrapper">
            <img src={props.imageSrc} alt={`Image showing ${props.title}`} />
            </div>
      </div>

      <div className="project-right">
            <p className="project-description">{props.description}</p>
            <div className="project-links">
            {props.links.map((item, index) => (
                <a
                key={index}
                className="project-link"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
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
