"use client";

import React, { use } from 'react';
import goalData from '@/data/goal.json';
import objectiveData from '@/data/objective.json';
import metricData from '@/data/metric.json'; // Assuming this is the correct metric data source
import projectData from '@/data/project.json';
import { Progress } from '@/components/ui/progress'; // For progress bars
import { Badge } from '@/components/ui/badge'; // For status badges
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

// Assuming Metric structure from metric.json, enhance as needed
interface Metric {
  id: string;
  name: string;
  value?: number | string; // Current value
  target?: number | string; // Target value
  unit?: string;
  status?: string; // e.g., "Meeting Target", "Below Target"
  goal?: string[]; // Assuming metrics might also use an array, adjust if not
  goalId?: string; // Keep for potential single direct link, or remove if 'goal' array is exclusive
  objectiveId?: string; // Link to objective
  description?: string;
  currentValue?: number; // Specific for some metric types
  targetValue?: number; // Specific for some metric types
  lastUpdated?: string;
}

interface Project {
  id: string;
  name: string;
  status?: string; // e.g., "Planning", "In Progress", "Completed", "On Hold"
  description?: string;
  lead?: string;
  goal?: string[]; // Changed from goalId: string
  objectiveId?: string; // Link to objective
  startDate?: string;
  endDate?: string;
}

interface ResolvedPageParams {
  goalId: string;
}

interface GoalProfilePageProps {
  params: Promise<ResolvedPageParams>;
}

export default function GoalProfilePage({ params: paramsPromise }: GoalProfilePageProps) {
  const { goalId } = use(paramsPromise);
  const goal = (goalData as Goal[]).find((g: Goal) => g.id === goalId);
  const relatedObjectives = (objectiveData as Objective[]).filter(obj => obj.goal && obj.goal.includes(goalId));
  const relatedMetrics = (metricData as Metric[]).filter(m => 
    (m.goal && m.goal.includes(goalId)) || 
    (m.goalId === goalId) || 
    relatedObjectives.some(obj => obj.id === m.objectiveId)
  );
  const relatedProjects = (projectData as Project[]).filter(p => 
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
                    {metric.status && <Badge variant={metric.status === 'Meeting Target' ? 'default' : 'outline'} className={`mb-2 ${metric.status === 'Meeting Target' ? 'bg-green-100 text-green-700' : 'border-red-500 text-red-500'}`}>{metric.status}</Badge>}
                    <p className="text-sm text-gray-700">Current: {metric.currentValue ?? metric.value ?? 'N/A'} {metric.unit || ''}</p>
                    <p className="text-sm text-gray-700">Target: {metric.targetValue ?? metric.target ?? 'N/A'} {metric.unit || ''}</p>
                    {metric.description && <p className="text-xs text-gray-500 mt-1">{metric.description}</p>}
                    {typeof metric.currentValue === 'number' && typeof metric.targetValue === 'number' && metric.targetValue > 0 && (
                       <div className="mt-2">
                        <Progress value={(metric.currentValue / metric.targetValue) * 100} className="h-2" />
                      </div>
                    )}
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
