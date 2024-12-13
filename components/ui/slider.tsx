"use client";

import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center select-none touch-none w-full h-6"
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="bg-gray-300 relative grow rounded-full h-2">
        <SliderPrimitive.Range className="absolute bg-blue-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow-md hover:bg-gray-100 focus:outline-none" />
    </SliderPrimitive.Root>
  );
}
