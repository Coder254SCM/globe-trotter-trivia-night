
import React from "react";

export const GlobeLegend: React.FC = () => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-4 px-6 py-3 bg-background/95 backdrop-blur-md rounded-full border border-border shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></div>
          <span>Hard</span>
        </div>
        <div className="h-6 w-px bg-border mx-2"></div>
        <div className="flex gap-2 items-center">
          <span className="font-medium whitespace-nowrap">Click on a country to start a quiz</span>
          <span className="hidden md:inline">or use search (⌘+K)</span>
        </div>
      </div>
    </div>
  );
};
