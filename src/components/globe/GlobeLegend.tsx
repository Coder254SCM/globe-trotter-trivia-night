
import React from "react";

export const GlobeLegend: React.FC = () => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center">
      <div className="flex items-center gap-4 px-6 py-3 bg-background/90 backdrop-blur-sm rounded-full border border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Easy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Hard</span>
        </div>
        <p className="ml-4">Click on a country to start a quiz</p>
      </div>
    </div>
  );
};
