import React from "react";
import { Info } from "lucide-react";

interface TipCardProps {
  title: string;
  description: string;
}

export default function TipCard({ title, description }: TipCardProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30 flex gap-4 transition-colors duration-300">
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shrink-0">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">{title}</h4>
        <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed mt-1">
          {description}
        </p>
      </div>
    </div>
  );
}
