import React from 'react';
import FormBlock from './FormBlock';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';

function renderSingle(block) {
  switch (block.type) {
    case 'form':
      return <FormBlock {...block} />;
    case 'text':
      return <TextBlock {...block} />;
    case 'image':
      return <ImageBlock {...block} />;
    default:
      return <div className="text-sm text-red-600">Unknown block type: {block.type}</div>;
  }
}

export default function BlockRenderer({ schema }) {
  if (!schema) return null;
  try {
    const parsed = typeof schema === 'string' ? JSON.parse(schema) : schema;
    if (Array.isArray(parsed)) {
      return (
        <div className="flex flex-col gap-6">
          {parsed.map((block, idx) => (
            <div key={block.id || idx}>{renderSingle(block)}</div>
          ))}
        </div>
      );
    }
    return renderSingle(parsed);
  } catch (err) {
    return <div className="text-sm text-red-600">Invalid schema: {err.message}</div>;
  }
}
