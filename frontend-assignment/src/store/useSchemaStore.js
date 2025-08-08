import { create } from 'zustand';

const useSchemaStore = create((set) => ({
  // Default schema JSON string
  schema: `{
    "type": "form",
    "fields": [
      { "label": "Email", "type": "email", "required": true },
      { "label": "Age", "type": "number", "min": 18 }
    ],
    "submitText": "Register",
    "onSubmit": "if (values.age < 21) return 'Too young';"
  }`,
  setSchema: (schema) => set({ schema }),
}));

export default useSchemaStore;
