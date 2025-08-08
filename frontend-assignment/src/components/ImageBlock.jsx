import React from "react";

export default function ImageBlock({ src, alt, className }) {
  if (!src) return <div>No image source provided.</div>;
  return (
    <div className={className || "my-4"}>
      <img
        src={src}
        alt={alt || "Image"}
        className="max-w-full rounded shadow"
        loading="lazy"
      />
    </div>
  );
}
