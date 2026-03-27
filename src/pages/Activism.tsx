import { Iactivism } from "../components/Iactivism";
import type { ActivismProps } from "../components/Iactivism";
import activismData from "../assets/activism/activism.json";
import "../components/Iproject.css";

const activismList = (activismData as ActivismProps[])
  .filter((item) => item.publish === 1)
  .sort((a, b) => {
    const [da, ma, ya] = a.date.split("/").map(Number);
    const [db, mb, yb] = b.date.split("/").map(Number);

    const dateA = new Date(ya, ma - 1, da).getTime();
    const dateB = new Date(yb, mb - 1, db).getTime();

    return dateB - dateA;
  });

const Activism = () => {
  return (
    <div className="outer">
      <h1>Activism</h1>
      {activismList.map((item, index) => (
        <Iactivism key={`activism-${index}`} {...item} />
      ))}
    </div>
  );
};

export default Activism;