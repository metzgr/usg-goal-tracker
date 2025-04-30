"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Pie, Cell } from "recharts";
import milestone from "@/data/milestone.json";
import milestoneResult from "@/data/milestoneResult.json";

export interface ProjectCardProps {
  project: any;
  milestoneResult: any[];
  milestoneCount?: number;
  compressed?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, milestoneResult, milestoneCount, compressed = false }) => {
  const [open, setOpen] = React.useState(false);
  // Get all milestones for this project, sorted by sequence
  const projectMilestones = (milestone as any[]).filter(m => Array.isArray(m.project) && m.project.includes(project.id));
  const sortedMilestones = [...projectMilestones].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  // Gather all quarters/years present in milestoneResult for these milestones
  const milestoneIds = sortedMilestones.map(m => m.id);
  const milestoneResults = (milestoneResult as any[]).filter(mr => Array.isArray(mr.milestone) && mr.milestone.some((id: string) => milestoneIds.includes(id)));
  // Unique sorted quarters/years
  const quarters = Array.from(new Set(milestoneResults.map(mr => `FY${mr.fiscalYear} Q${mr.fiscalQuarter}`))).sort();
  // Helper to get result for a milestone in a specific quarter
  function getResultStatus(mid: string, quarter: string) {
    const mr = milestoneResults.find(mr => Array.isArray(mr.milestone) && mr.milestone.includes(mid) && `FY${mr.fiscalYear} Q${mr.fiscalQuarter}` === quarter);
    return mr?.result;
  }
  // Helper to color-code status
  function statusColor(status: string) {
    if (!status) return "bg-gray-200 text-gray-700";
    if (status === "Complete" || status === "Completed") return "bg-green-100 text-gray-900";
    if (status === "Progressed") return "bg-blue-100 text-gray-900";
    if (status === "Blocked") return "bg-yellow-100 text-gray-900";
    if (status === "Not started") return "bg-gray-100 text-gray-900";
    return "bg-gray-300 text-gray-800";
  }
  // Use milestoneCount from project table if provided, else fallback to milestoneResult.length
  const total = typeof milestoneCount === 'number' ? milestoneCount : milestoneResult.length;
  const progressed = typeof project.milestoneIsProgressedCount === 'number' ? project.milestoneIsProgressedCount : 0;
  const complete = typeof project.milestoneIsCompletedCount === 'number' ? project.milestoneIsCompletedCount : 0;
  const blocked = typeof project.milestoneIsBlockedCount === 'number' ? project.milestoneIsBlockedCount : 0;
  const percentComplete = total > 0 ? Math.round((complete / total) * 100) : 0;

  const donutData = [
    { name: "Complete", value: complete },
    { name: "Other", value: total - complete },
  ];
  const COLORS = ["#4f46e5", "#e5e7eb"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className={`w-full h-full bg-white shadow-none border-1 border-white rounded-none transition-all duration-200 cursor-pointer ${compressed ? 'mb-2 p-1' : 'mb-6 max-w-xl'} hover:border-1 hover:border-gray-300`}
          onClick={() => setOpen(true)}
        >
          <CardContent className={`flex flex-1 h-full items-center justify-center flex-col ${compressed ? 'py-3 px-2' : ''}`}>
            <div className="flex flex-col md:flex-row w-full h-full items-center justify-center mb-4 gap-2 md:gap-0">
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
                  <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Completed</div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className={compressed ? 'text-base font-bold' : 'text-2xl font-bold'}>{blocked}</div>
                  <div className={compressed ? 'text-[10px] text-muted-foreground' : 'text-xs text-muted-foreground'}>Blocked</div>
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
      </DialogTrigger>
      <DialogContent className="!max-w-none w-full">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border text-xs md:text-sm">
            <thead>
              <tr>
                <th className="border px-2 py-2 text-center text-xs bg-gray-50"></th>
                <th className="border px-2 py-2 text-left text-xs bg-gray-50">Milestone</th>
                {quarters.map(q => (
                  <th key={q} className="border px-2 py-1 text-center text-xs bg-gray-50">{q}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedMilestones.map(m => {
                // Find all results for this milestone
                const resultsForMilestone = milestoneResults.filter(
                  mr => Array.isArray(mr.milestone) && mr.milestone.includes(m.id)
                );
                // Find the most recent result using isMostRecent
                const mostRecentResult = resultsForMilestone.find(r => r.isMostRecent === 1);
                const isChecked = mostRecentResult && (mostRecentResult.result === 'Completed' || mostRecentResult.result === 'Complete');
                return (
                  <tr key={m.id}>
                    <td className="border px-2 py-2 bg-white text-center align-middle">
                      <input type="checkbox" checked={isChecked} readOnly className="accent-green-200 w-4 h-4" />
                    </td>
                    <td className="border px-2 py-2 font-normal bg-white whitespace-nowrap">{m.name}</td>
                    {quarters.map(q => {
                      const status = getResultStatus(m.id, q);
                      return (
                        <td key={q} className="border px-2 py-1 text-center bg-white">
                          {status ? (
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColor(status)}`}>{status}</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
