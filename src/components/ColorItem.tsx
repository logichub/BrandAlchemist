import React from 'react';
import { Color } from '../types';
import { GripVertical, X, ChevronUp, ChevronDown } from 'lucide-react';

interface ColorItemProps {
  key?: React.Key;
  color: Color;
  index: number;
  totalColors: number;
  onChange: (id: string, updates: Partial<Color>) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export function ColorItem({ color, index, totalColors, onChange, onRemove, onMove }: ColorItemProps) {
  // Simple check if color is valid hex
  const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color.hex);

  return (
    <div className="flex items-center gap-1.5 p-1 border border-[#E5E1D9] rounded-lg group transition-colors hover:border-[#D4CDBC] bg-white">
      
      {/* Reorder controls (keeping them minimal) */}
      <div className="flex flex-col text-[#E5E1D9] opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onMove(index, 'up')} 
          disabled={index === 0}
          className="hover:text-[#5A5A40] disabled:opacity-30 disabled:hover:text-[#E5E1D9] px-0.5"
        >
          <ChevronUp size={10} />
        </button>
        <button 
          onClick={() => onMove(index, 'down')} 
          disabled={index === totalColors - 1}
          className="hover:text-[#5A5A40] disabled:opacity-30 disabled:hover:text-[#E5E1D9] px-0.5"
        >
          <ChevronDown size={10} />
        </button>
      </div>

      {/* Swatch & Picker */}
      <div className="relative">
        <div 
          className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] overflow-hidden flex-shrink-0 cursor-pointer shadow-sm"
          style={{ backgroundColor: isValidHex ? color.hex : '#eee' }}
        >
          <input 
            type="color" 
            value={isValidHex ? color.hex : '#000000'}
            onChange={(e) => onChange(color.id, { hex: e.target.value })}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 justify-center">
        <input
          type="text"
          value={color.name}
          onChange={(e) => onChange(color.id, { name: e.target.value })}
          placeholder="Color Name"
          className="text-[10px] font-bold uppercase text-[#8C8984] bg-transparent outline-none truncate w-full placeholder:text-[#D4CDBC]"
        />
        <div className="flex items-center">
          <span className="text-xs font-mono text-[#8C8984] mr-0.5 pointer-events-none">#</span>
          <input
            type="text"
            value={color.hex.replace(/^#/, '')}
            onChange={(e) => {
              const val = e.target.value.replace(/^#/, '');
              onChange(color.id, { hex: '#' + val });
            }}
            placeholder="000000"
            className={`text-xs font-mono bg-transparent outline-none truncate w-full ${!isValidHex && color.hex && color.hex !== '#' ? 'text-red-500' : 'text-[#2D2D2A]'}`}
          />
        </div>
      </div>

      <button 
        onClick={() => onRemove(color.id)}
        className="text-[#8C8984] hover:text-[#5A5A40] px-1.5 text-[10px] font-medium"
        aria-label="Remove color"
      >
        ✕
      </button>
    </div>
  );
}
