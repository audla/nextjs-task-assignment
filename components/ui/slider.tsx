"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import clsx from "clsx";  // Changed cx to clsx

export const focusRing = [
  "outline",
  "outline-offset-2",
  "outline-0",
  "focus-visible:outline-2",
  "outline-blue-500",
  "dark:outline-blue-500",
];

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  ariaLabelThumb?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ariaLabelThumb, ...props }, forwardedRef) => {
  const value = props.value || props.defaultValue;

  return (
    <SliderPrimitive.Root
      ref={forwardedRef}
      className={clsx(  // Changed to clsx
        "relative flex cursor-pointer touch-none select-none",
        "data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-fit data-[orientation='vertical']:justify-center",
        "data-[disabled]:pointer-events-none",
        className
      )}
      tremor-id="tremor-raw"
      {...props}
    >
      <SliderPrimitive.Track
        className={clsx(  // Changed to clsx
          "relative grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
          "data-[orientation='horizontal']:h-1.5 data-[orientation='horizontal']:w-full",
          "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          className={clsx(  // Changed to clsx
            "absolute rounded-full bg-blue-500 dark:bg-blue-500",
            "data-[orientation='horizontal']:h-full",
            "data-[orientation='vertical']:w-full",
            "data-[disabled]:bg-gray-300 dark:data-[disabled]:bg-gray-700"
          )}
        />
      </SliderPrimitive.Track>
      {value?.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={clsx(  // Changed to clsx
            "block size-[17px] shrink-0 rounded-full border shadow transition-all",
            "border-gray-400 dark:border-gray-500",
            "bg-white",
            "data-[disabled]:pointer-events-none data-[disabled]:bg-gray-200 dark:data-[disabled]:border-gray-800 dark:data-[disabled]:bg-gray-600",
            ...focusRing,  // Use the spread operator to correctly merge the `focusRing` array
            "outline-offset-0"
          )}
          aria-label={ariaLabelThumb}
        />
      ))}
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
