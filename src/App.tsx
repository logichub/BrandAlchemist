import React from 'react';
import { useDesignState } from './hooks/useDesignState';
import { Controls } from './components/Controls';
import { Preview } from './components/Preview';

export default function App() {
  const designSystem = useDesignState();

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden text-[#2D2D2A] bg-[#F7F5F2] font-sans">
      {/* Constraints: Left Panel fixed width on desktop, full on mobile */}
      <div className="w-full lg:w-[380px] lg:flex-shrink-0 z-10 lg:shadow-[4px_0_24px_rgba(90,90,64,0.02)] h-1/2 lg:h-full flex flex-col bg-white border-r border-[#E5E1D9]">
        <Controls {...designSystem} />
      </div>
      
      <div className="flex-1 relative z-0 h-1/2 lg:h-full">
        <Preview state={designSystem.state} />
      </div>
    </div>
  );
}
