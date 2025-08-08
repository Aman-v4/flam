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
        <h1 className="text-2xl mb-10 text-black font-semibold  md:text-4xl tracking-wide">Dynamic Interface Compiler</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="shadow-[5px_5px_0px_rgba(0,0,0,1)]  hover:scale-95 transition-all duration-300 ease-in-out active:scale-90 cursor-pointer  bg-[#58EA8E] px-5 py-3 text-sm font-semibold tracking-wider text-gray-800"
            onClick={() => loadSample("form")}
          >
            Sample Form
          </button>
          <button
            className="shadow-[5px_5px_0px_rgba(0,0,0,1)]  hover:scale-95 transition-all duration-300 ease-in-out active:scale-90 cursor-pointer  bg-[#58EA8E] px-3 py-1.5 text-sm font-semibold tracking-wider text-gray-800"
            onClick={() => loadSample("text")}
          >
            Sample Text
          </button>
          <button
            className="shadow-[5px_5px_0px_rgba(0,0,0,1)]  hover:scale-95 transition-all duration-300 ease-in-out active:scale-90 cursor-pointer  bg-[#58EA8E] px-4 py-2 text-sm font-semibold tracking-wider text-gray-800"
            onClick={() => loadSample("image")}
          >
            Sample Image
          </button>
          <button
            className="shadow-[5px_5px_0px_rgba(0,0,0,1)]  hover:scale-95 transition-all duration-300 ease-in-out active:scale-90 cursor-pointer  bg-[#58EA8E] px-2 py-2 text-sm font-semibold tracking-wider text-gray-800"
            onClick={() => loadSample("page")}
          >
            Sample Page
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-black tracking-wide ">Define UI Blocks (JSON)</h2>
          <JsonEditor value={liveSchema} onChange={handleJsonChange} />
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-black tracking-wide">Live Preview</h2>
          <div className=" shadow-[10px_10px_0px_rgba(0,0,0,1)]  bg-[#FEFDDD] p-4">
            <BlockRenderer schema={liveSchema} />
          </div>
        </section>
      </div>
    </div>
  );
}
