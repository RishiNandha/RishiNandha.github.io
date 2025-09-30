import { useEffect } from "react";
import { Imusic } from "../components/Imusic";
import type { MusicProps } from "../components/Imusic";

import musicData from "../assets/music/music.json";

const musicList = musicData as MusicProps[];

const Music = () => {
  useEffect(() => {
    const hasInstagram = musicList.some((track) => track.linkType === "instagram");

    if (hasInstagram) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // cleanup if leaving page
        document.body.removeChild(script);
      };
    }
  }, []);

  // Keep newest first (if you later add "year" or "createdAt")
  const sortedMusic = [...musicList];

  // Split into Originals vs Covers
  const originals = sortedMusic.filter((track) => track.type === "original");
  const covers = sortedMusic.filter((track) => track.type === "cover");

  // Map to cards
  const originalCards = originals.map((track, index) => (
    <Imusic key={`original-${index}`} {...track} />
  ));
  const coverCards = covers.map((track, index) => (
    <Imusic key={`cover-${index}`} {...track} />
  ));

  return (
    <div className="outer">
      {originalCards.length > 0 && (
        <div className="outer">
          <h1>Originals</h1>
          {originalCards}
        </div>
      )}

      {coverCards.length > 0 && (
        <div className="outer">
          <h1>Covers</h1>
          {coverCards}
        </div>
      )}
    </div>
  );
};

export default Music;
