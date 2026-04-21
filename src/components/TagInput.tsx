import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add a generic tag...' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-[#E5E1D9] text-[#5A5A40] px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all hover:bg-[#D4CDBC]"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:opacity-80 focus:outline-none ml-1"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
      />
    </div>
  );
}
