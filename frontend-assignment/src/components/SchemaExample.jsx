import React from "react";
import useSchemaStore from "../store/useSchemaStore";

export default function SchemaExample() {
  const schema = useSchemaStore((state) => state.schema);
  const setSchema = useSchemaStore((state) => state.setSchema);

  const handleChange = (e) => {
    setSchema(e.target.value);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="mb-2 font-semibold text-lg">Schema Viewer & Editor</h2>
      <textarea
        value={schema}
        onChange={handleChange}
        rows={10}
        className="w-full border rounded p-2 font-mono text-sm"
      />
      <pre className="bg-gray-100 p-2 rounded mt-2">{schema}</pre>
    </div>
  );
}
