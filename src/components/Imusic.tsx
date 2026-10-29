// src/components/Imusic.tsx
import "./Imusic.css";
import { useEffect, useRef, type JSX, type CSSProperties } from "react";
import { FaSpotify, FaYoutube, FaApple } from "react-icons/fa";

export type StreamingLinks = {
  spotify?: string;
  youtubeMusic?: string;
  appleMusic?: string;
};

export type MusicProps = {
  title: string;
  embedUrl: string;         // e.g. https://www.instagram.com/reel/CnqLqsKjefl/
  description: string;
  type: "original" | "cover";
  linkType: "instagram" | "youtube";
  links?: StreamingLinks;   // optional: only songs that are on streaming platforms
};

// Order, label, icon and brand colour for each streaming platform
const PLATFORMS = [
  { key: "spotify", label: "Spotify", Icon: FaSpotify, color: "#1DB954" },
  { key: "youtubeMusic", label: "YouTube Music", Icon: FaYoutube, color: "#FF0000" },
  { key: "appleMusic", label: "Apple Music", Icon: FaApple, color: "#FFFFFF" },
] as const;

function withTrailingSlash(url: string) {
  const u = url.split("?")[0];
  return u.endsWith("/") ? u : `${u}/`;
}

function StreamingRow({ links }: { links: StreamingLinks }) {
  const available = PLATFORMS.filter((p) => links[p.key]);
  if (available.length === 0) return null;
  return (
    <div className="music-streaming">
      {available.map(({ key, label, Icon, color }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          className="stream-btn"
          style={{ "--brand": color } as CSSProperties}
        >
          <Icon className="stream-btn__icon" aria-hidden="true" />
          <span className="stream-btn__text">
            <span className="stream-btn__pre">Listen on</span>
            <span className="stream-btn__name">{label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export function Imusic(props: MusicProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load the Instagram script when needed, then process just our container
  useEffect(() => {
    if (props.linkType !== "instagram") return;

    const processEmbeds = () => {
      const inst = (window as any)?.instgrm;
      if (inst?.Embeds?.process) {
        // Scope processing to our container (avoids reprocessing whole page)
        inst.Embeds.process(containerRef.current);
      }
    };

    // If script already present, process immediately
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="//www.instagram.com/embed.js"]'
    );

    if (existing) {
      if ((window as any)?.instgrm) {
        // Script loaded & global ready
        processEmbeds();
      } else {
        // Not ready yet; wait for load
        const onLoad = () => processEmbeds();
        existing.addEventListener("load", onLoad, { once: true });
        return () => existing.removeEventListener("load", onLoad);
      }
      return;
    }

    // Inject script once
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    script.addEventListener("load", processEmbeds, { once: true });
    document.body.appendChild(script);

    // optional cleanup (we usually leave the script in place)
    return () => {
      script.removeEventListener("load", processEmbeds);
      // document.body.removeChild(script); // uncomment only if you really want to remove
    };
  }, [props.linkType, props.embedUrl]);

  let embed: JSX.Element | null = null;

  if (props.linkType === "youtube") {
    embed = (
      <iframe
        width="100%"
        height="315"
        src={props.embedUrl}
        title={props.title}
        frameBorder={0}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  } else if (props.linkType === "instagram") {
    const permalink = withTrailingSlash(props.embedUrl);

    // This is the React-safe version of Instagram’s official embed snippet.
    embed = (
      <blockquote
        key={permalink} // re-render if URL changes
        className="instagram-media"
        data-instgrm-permalink={`${permalink}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: 3,
          boxShadow:
            "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "1px auto",
          maxWidth: "540px",
          minWidth: "326px",
          width: "99%",
        }}
      />
    );
  }

  return (
    <div className="oneunit" ref={containerRef}>
      <h2 className="music-title">{props.title}</h2>
      <div className="music-embed">{embed}</div>
      <p className="music-description">{props.description}</p>
      {props.links && <StreamingRow links={props.links} />}
    </div>
  );
}