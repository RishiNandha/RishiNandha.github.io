import {Iproject} from "../components/Iproject"
import type { ProjProps } from "../components/Iproject";

import projectsData from "../assets/projects/projects.json"

const projectsList = projectsData as ProjProps[];

const Projects = () => {
  // sort all projects by year (descending)
  const sortedProjects = [...projectsList].sort((a, b) => b.year - a.year);

  // split into groups
  const researchProjects = sortedProjects.filter(
    (proj) => proj.type === "research"
  );
  const otherProjects = sortedProjects.filter(
    (proj) => proj.type === "other"
  );

  const researchCards = researchProjects.map((proj, index) => (
    <Iproject key={`research-${index}`} {...proj} />
  ));

  const otherCards = otherProjects.map((proj, index) => (
    <Iproject key={`other-${index}`} {...proj} />
  ));

  return (
    <div className="outer">
      {researchCards.length > 0 && (
        <div className="outer">
          <h1>Research Projects</h1>
          {researchCards}
        </div>
      )}

      {otherCards.length > 0 && (
        <div className="outer">
          <h1>Other Projects</h1>
          <div className="reducemargin"><p>These are some other projects that have given me some inter-disciplinary exposure. While not directly related with my primary research areas, these have broadened my perspective on the emerging paradigms of computing</p></div>
          {otherCards}
        </div>
      )}
    </div>
  );
};



export default Projects;