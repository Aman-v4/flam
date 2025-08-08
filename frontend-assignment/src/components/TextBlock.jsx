import React from "react";

export default function TextBlock({ text }) {
  return (
    <div className="p-4 max-w-md border rounded bg-white shadow">{text}</div>
  );
}
