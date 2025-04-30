"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell } from "recharts";

export interface ProjectCardProps {
  project: any;
  milestoneResults: any[];
  compressed?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, milestoneResults, compressed = false }) => {
  const total = milestoneResults.length;
  const progressed = milestoneResults.filter((m) => m.status === "Progressed").length;
  const complete = milestoneResults.filter((m) => m.status === "Complete").length;
  const percentComplete = total > 0 ? Math.round((complete / total) * 100) : 0;

  const donutData = [
    { name: "Complete", value: complete },
    { name: "Other", value: total - complete },
  ];
  const COLORS = ["#4f46e5", "#e5e7eb"];

  return (
    <Card className={`w-full bg-white shadow-none border-0 rounded-none ${compressed ? 'mb-2 p-1' : 'mb-6 max-w-xl'}`}>
      <CardContent className={`flex items-center flex-col ${compressed ? 'py-3 px-2' : ''}`}>
        <div className="flex flex-col md:flex-row w-full items-stretch mb-4 gap-2 md:gap-0">
          {/* Left: Project Name only */}
          <div className="flex-1 flex flex-col items-center justify-center md:items-start md:justify-center pb-2 md:pb-0">
            <span className={compressed ? 'text-sm font-normal' : 'text-base font-normal'}>{project.name}</span>
          </div>
          {/* Right: Milestone Info + Donut */}
          <div className="flex-[2] flex flex-row divide-x divide-gray-200 items-center">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{total}</div>
              <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Milestones</div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{progressed}</div>
              <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Progressed</div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{complete}</div>
              <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Complete</div>
            </div>
            {/* Donut Chart */}
            <div className="flex-1 flex flex-col items-center justify-center px-2">
              <PieChart width={compressed ? 36 : 48} height={compressed ? 36 : 48}>
                <Pie
                  data={donutData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={compressed ? 10 : 14}
                  outerRadius={compressed ? 16 : 22}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                >
                  {donutData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
                  ))}
                </Pie>
              </PieChart>
              <div className="text-[10px] text-muted-foreground mt-1">{percentComplete}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
