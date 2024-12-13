"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Assignment } from "@/lib/airtable"

interface PercentDonutChartProps {
    percent: number;
}

export default function PercentDonutChart({percent}:PercentDonutChartProps) {
  percent = Math.round(percent * 100)
  
  const data = [
    { name: "Complete", value: percent },
    { name: "Incomplete", value: 100 - percent }
  ]

  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"]

  console.log("Assignment prop received:", percent);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Assignment Progression</CardTitle>
        <CardDescription>Visualize percentage as a donut chart</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-4xl font-bold">{percent}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}