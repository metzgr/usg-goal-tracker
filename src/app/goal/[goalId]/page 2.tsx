"use client";

import React, { use } from 'react';
import goalsData from "@/data/goal.json";
import objectivesData from "@/data/objective.json";
import metricsData from "@/data/metric.json";
import projectsData from "@/data/project.json";
import metricResultsData from "@/data/metricResult.json"; // Import metric results
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LineChart from "@/components/charts/line-chart";
import ProgressBarChart from "@/components/charts/progress-bar-chart";
import StatHeader from "@/components/charts/stat-header";
import Header from '@/components/custom/header';

// Enhanced Goal Interface (can be expanded further)
interface Goal {
  id: string;
  name: string;
  status?: string; // e.g., "On Track", "At Risk", "Achieved"
  description?: string;
  plan?: string[]; // Associated APG IDs
  startDate?: string;
  endDate?: string;
  progress?: number; // Overall progress percentage (0-100)
  owner?: string; // Owning organization or team
}

interface Objective {
  id: string;
  goal: string[]; // Changed from goalId: string
  name: string;
  description?: string;
  status?: string; // e.g., "On Track", "Delayed", "Completed"
  progress?: number; // Progress percentage (0-100)
}

// Raw data structure from metric.json
interface RawMetricDefinition {
  id: string;
  name: string;
  description?: string;
  goal?: string[];
  objective?: string[]; // If metrics can be linked to objectives
  mostRecentResult?: (number | string | null)[];
  mostRecentTargetResult?: (number | string | null)[];
  mostRecentPercentProgress?: (number | null)[];
  mostRecentTargetDirection?: string[];
  status?: string; // Optional status from metric.json itself
  unitFormat?: string; // Optional unitFormat from metric.json
  percentChangeResult?: number;
  mostRecentTargetLevel?: (number | null)[];
  // Add any other fields from metric.json that are accessed
}

interface MetricResult {
  id: string;
  metric: string[];
  targetResult?: number | null;
  result?: number | null;
  fiscalQuarter?: number;
  fiscalYear?: number;
  targetDirection?: string;
  startDate?: string;
  endDate: string; // Important for sorting
  // Add other fields from metricResult.json as needed
}

interface Metric {
  id: string;
  name: string;
  description?: string;
  status?: string; // e.g., "On Track", "Below Target"
  goal?: string[];
  currentValue?: number | string | null;
  targetValue?: number | string | null;
  progress?: number; // Calculated from mostRecentPercentProgress
  unitFormat?: string; // For StatHeader
  percentChangeResult?: number; // For StatHeader
  mostRecentTargetLevel?: number | null; // For ProgressBarChart
  historicalActuals?: (number | null)[];
  historicalTargets?: (number | null)[];
  // Raw metric definition fields that might be useful for ProgressBarChart or StatHeader
  rawMostRecentResult?: (number | string | null)[];
  rawMostRecentTargetResult?: (number | string | null)[];
  rawMostRecentPercentProgress?: (number | null)[];
  rawMostRecentTargetDirection?: string[];
}

interface Project {
  id: string;
  name: string;
  goal: string[];
  description?: string;
  status?: string; // e.g., "Planning", "In Progress", "Completed"
  lead?: string; // Project lead or manager
  objectiveId?: string; // Link to objective, used in filtering
  // Add other fields from project.json as needed
}

interface ResolvedPageParams {
  goalId: string;
}

interface GoalProfilePageProps {
  params: Promise<ResolvedPageParams>;
}

export default function GoalProfilePage({ params: paramsPromise }: GoalProfilePageProps) {
  const { goalId } = use(paramsPromise);
  const goal = (goalsData as Goal[]).find((g: Goal) => g.id === goalId);
  const relatedObjectives = (objectivesData as Objective[]).filter(obj => obj.goal && obj.goal.includes(goalId));
  const relatedMetrics: Metric[] = (metricsData as RawMetricDefinition[])
    .filter(metricDef => metricDef.goal?.includes(goalId)) // Corrected: use goalId
    .map(metricDef => {
      const resultsForMetric = metricResultsData
        .filter(mr => mr.metric?.includes(metricDef.id))
        .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) as MetricResult[];

      const historicalActuals = resultsForMetric.map(r => r.result);
      const historicalTargets = resultsForMetric.map(r => r.targetResult);
      
      let status = "N/A";
      const mostRecentResultVal = metricDef.mostRecentResult?.[0];
      const mostRecentTargetVal = metricDef.mostRecentTargetResult?.[0];
      const targetDirection = metricDef.mostRecentTargetDirection?.[0]?.toLowerCase();

      if (typeof mostRecentResultVal === 'number' && typeof mostRecentTargetVal === 'number') {
        if (targetDirection === 'increase') {
          if (mostRecentResultVal >= mostRecentTargetVal) status = "Meeting Target";
          else if (mostRecentResultVal < mostRecentTargetVal) status = "Below Target";
        } else if (targetDirection === 'decrease') {
          if (mostRecentResultVal <= mostRecentTargetVal) status = "Meeting Target";
          else if (mostRecentResultVal > mostRecentTargetVal) status = "Above Target";
        } else { // Maintain or other directions
            // Simple equality check for 'maintain'
            if (mostRecentResultVal === mostRecentTargetVal) status = "Meeting Target";
            else status = "Off Target"; 
        }
      } else if (metricDef.status) { // Accessing optional prop from RawMetricDefinition
        status = metricDef.status;
      }

      return {
        ...metricDef,
        currentValue: mostRecentResultVal,
        targetValue: mostRecentTargetVal,
        progress: metricDef.mostRecentPercentProgress?.[0] != null ? metricDef.mostRecentPercentProgress[0] * 100 : undefined,
        historicalActuals,
        historicalTargets,
        status,
        // Pass raw values for components that expect them in array form or specific structures
        rawMostRecentResult: metricDef.mostRecentResult,
        rawMostRecentTargetResult: metricDef.mostRecentTargetResult,
        rawMostRecentPercentProgress: metricDef.mostRecentPercentProgress,
        rawMostRecentTargetDirection: metricDef.mostRecentTargetDirection,
        unitFormat: metricDef.unitFormat, // Accessing optional prop from RawMetricDefinition
        percentChangeResult: typeof metricDef.percentChangeResult === 'number' ? metricDef.percentChangeResult : 0,
        mostRecentTargetLevel: metricDef.mostRecentTargetLevel?.[0],
      } as Metric;
    });
  const relatedProjects = (projectsData as Project[]).filter(p => 
    (p.goal && p.goal.includes(goalId)) || 
    relatedObjectives.some(obj => obj.id === p.objectiveId)
  );

  if (!goal) {
    return (
      <>
        <Header activeItem="" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Goal Not Found</h1>
            <p className="text-gray-700 mt-2">The goal with ID '{goalId}' could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header activeItem="" />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 border-b pb-4">{goal.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Core Details</h2>
              <p className="text-gray-600 mb-1"><span className="font-medium text-gray-700">ID:</span> {goal.id}</p>
              <p className="text-gray-600"><span className="font-medium text-gray-700">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${goal.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {goal.status || 'N/A'}
                </span>
              </p>
            </div>
            {goal.description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{goal.description}</p>
              </div>
            )}
          </div>
          
          {goal.plan && goal.plan.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Associated Strategic Plans</h2>
              <div className="space-y-2">
                {goal.plan.map(planId => (
                  <div key={planId} className="bg-gray-50 p-3 rounded-md shadow-sm">
                     <p className="text-gray-700">Plan ID: {planId}</p>
                  </div>
                ))}
              </div> {/* Corrected: Was ul, changed to div to close space-y-2 div */}
            </div>
          )}

          {/* Objectives Section */}
          {relatedObjectives.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contributing Objectives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedObjectives.map(obj => (
                  <div key={obj.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-blue-600 mb-1">{obj.name}</h3>
                    {obj.status && <Badge variant={obj.status === 'Completed' ? 'default' : 'secondary'} className={`mb-2 ${obj.status === 'Completed' ? 'bg-green-500' : obj.status === 'In Progress' || obj.status === 'On Track' ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}>{obj.status}</Badge>}
                    {obj.description && <p className="text-sm text-gray-600 mb-2 truncate hover:whitespace-normal">{obj.description}</p>}
                    {typeof obj.progress === 'number' && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{obj.progress}%</span>
                        </div>
                        <Progress value={obj.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Section */}
          {relatedMetrics.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Key Performance Metrics</h2>
              <div className="space-y-4">
                {relatedMetrics.map(metric => (
                  <div key={metric.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-purple-600 mb-1">{metric.name}</h3>
                    {metric.status && <Badge variant={metric.status === 'Meeting Target' || metric.status === 'On Track' || metric.status === 'Achieved' ? 'default' : 'outline'} className={`mb-2 ${metric.status === 'Meeting Target' || metric.status === 'On Track' || metric.status === 'Achieved' ? 'bg-green-100 text-green-700' : metric.status === 'Below Target' || metric.status === 'Above Target' || metric.status === 'Off Target' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{metric.status}</Badge>}
                    {metric.description && <p className="text-sm text-gray-600 mb-3">{metric.description}</p>}
                    <StatHeader 
                      mostRecentResult={metric.rawMostRecentResult?.[0] as number ?? 0}
                      percentChangeResult={metric.percentChangeResult ?? 0}
                      unitFormat={metric.unitFormat}
                    />
                    <div className="h-48 w-full mt-2 mb-4 pr-4"> {/* Ensure LineChart has dimensions */}
                      <LineChart 
                        dataActuals={metric.historicalActuals?.filter(v => v !== null) as number[] ?? []} 
                        dataTargets={metric.historicalTargets?.filter(v => v !== null) as number[] ?? []} 
                      />
                    </div>
                    <ProgressBarChart 
                      mostRecentResult={metric.rawMostRecentResult?.[0] as number ?? 0}
                      mostRecentTargetLevel={metric.mostRecentTargetLevel ?? 0} 
                      mostRecentTargetResult={metric.rawMostRecentTargetResult?.[0] as number ?? 0}
                      mostRecentPercentProgress={metric.progress ?? 0}
                    />    
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Supporting Projects & Initiatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map(project => (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-teal-600 mb-1">{project.name}</h3>
                    {project.status && <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'} className={`mb-2 ${project.status === 'Completed' ? 'bg-green-500' : project.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'} text-white`}>{project.status}</Badge>}
                    {project.lead && <p className="text-sm text-gray-600">Lead: {project.lead}</p>}
                    {project.description && <p className="text-xs text-gray-500 mt-1 truncate hover:whitespace-normal">{project.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500 text-center">End of Goal Tracker View.</p>
          </div>
        </div>
      </div>
    </>
  );
}
