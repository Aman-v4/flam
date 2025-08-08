import React from "react";
import Editor from "@monaco-editor/react";

export default function JsonEditor({ value, onChange }) {
  return (
    <div className="overflow-hidden ">
      <Editor
        height="420px"
        defaultLanguage="json"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange?.(val ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
