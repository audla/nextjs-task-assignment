"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TimeSliderProps {
  onSave: (ActualWorkTime: number) => void; // Function to call when saving the time
}

const TimeSlider: React.FC<TimeSliderProps> = ({ onSave }) => {
  const [addedTime, setAddedTime] = useState(0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSave = () => {
    onSave(addedTime); // Call the provided callback with the time
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Time Slider</CardTitle>
        <CardDescription>Add time worked on the assignment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Slider
            min={0}
            max={240}
            step={5}
            value={[addedTime]}
            onValueChange={(value) => setAddedTime(value[0])}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0m</span>
            <span>1h</span>
            <span>2h</span>
            <span>3h</span>
            <span>4h</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none">Added Time</p>
          <p className="text-3xl font-bold text-primary">{formatTime(addedTime)}</p>
        </div>
        <Button onClick={handleSave} className="w-full">
          Save Time
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeSlider;
