import React, { useState, useEffect } from "react";
import JsonEditor from "../components/JsonEditor";
import BlockRenderer from "../components/BlockRenderer";
import useSchemaStore from "../store/useSchemaStore";

const samples = {
  form: `{
  "type": "form",
  "title": "Register",
  "description": "Create your account",
  "fields": [
    { "label": "Email", "type": "email", "required": true },
    { "label": "Password", "type": "password", "required": true, "minLength": 6 },
    { "label": "Age", "type": "number", "min": 18, "placeholder": "18+ only" },
    { "label": "Role", "type": "select", "options": ["user", "admin"] },
    { "label": "Bio", "type": "textarea", "maxLength": 200 }
  ],
  "submitText": "Create account",
  "onSubmit": "if (values.age && values.age < 21) return 'Too young to register';"
}`,
  text: `{
  "type": "text",
  "text": "Hello world! This is a text block rendered from JSON."
}`,
  image: `{
  "type": "image",
  "src": "https://picsum.photos/600/300",
  "alt": "Random image"
}`,
  page: `[
  { "type": "text", "text": "Welcome!" },
  { "type": "image", "src": "https://picsum.photos/800/200", "alt": "Banner" },
  {
    "type": "form",
    "title": "Contact us",
    "fields": [
      { "label": "Your email", "type": "email", "required": true },
      { "label": "Message", "type": "textarea", "required": true }
    ],
    "submitText": "Send"
  }
]`,
};

export default function Home() {
  const { schema, setSchema } = useSchemaStore();
  const [liveSchema, setLiveSchema] = useState(schema || "");

  useEffect(() => {
    const saved = localStorage.getItem("block-schema");
    if (saved) {
      setLiveSchema(saved);
      setSchema(saved);
    }
  }, [setSchema]);

  const handleJsonChange = (val) => {
    const safeVal = typeof val === "string" ? val : "";
    setLiveSchema(safeVal);
    setSchema(safeVal);
    localStorage.setItem("block-schema", safeVal);
  };

  const loadSample = (key) => {
    handleJsonChange(samples[key]);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <header className="mb-6 flex flex-col items-center justify-between gap-3 md:mb-10 md:flex-row">
        <h1 className="text-2xl font-bold md:text-3xl">Dynamic Interface Compiler</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow hover:bg-gray-50"
            onClick={() => loadSample("form")}
          >
            Sample Form
          </button>
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow hover:bg-gray-50"
            onClick={() => loadSample("text")}
          >
            Sample Text
          </button>
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow hover:bg-gray-50"
            onClick={() => loadSample("image")}
          >
            Sample Image
          </button>
          <button
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow hover:bg-gray-50"
            onClick={() => loadSample("page")}
          >
            Sample Page
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold">Define UI Blocks (JSON)</h2>
          <JsonEditor value={liveSchema} onChange={handleJsonChange} />
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Live Preview</h2>
          <div className="rounded-lg border bg-gray-50 p-4">
            <BlockRenderer schema={liveSchema} />
          </div>
        </section>
      </div>
    </div>
  );
}
