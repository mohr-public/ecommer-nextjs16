"use client";

import { PulseLoader } from "react-spinners";

export default function PageLevelLoader({ text, color, loading, size }) {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex flex-col justify-center items-center z-50">
        <span className="flex gap-1 items-center">
            {text}
            <PulseLoader
                color={color}
                loading={loading}
                size={size || 10}
                data-testid="loader"
            />
        </span>
    </div>
  );
}