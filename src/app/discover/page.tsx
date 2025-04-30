"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/base/explore-card";

import fpiProgram from "@/data/fpiProgram.json";
import goal from "@/data/goal.json";
import image from "@/data/image.json";
import metric from "@/data/metric.json";
import metricMeasurement from "@/data/metricMeasurement.json";
import metricResult from "@/data/metricResult.json";
import milestone from "@/data/milestone.json";
import milestoneMeasurement from "@/data/milestoneMeasurement.json";
import milestoneResult from "@/data/milestoneResult.json";
import objective from "@/data/objective.json";
import org from "@/data/org.json";
import plan from "@/data/plan.json";
import project from "@/data/project.json";
import service from "@/data/service.json";
import serviceProvider from "@/data/serviceProvider.json";
import tag from "@/data/tag.json";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const PLAN_ID = "recOMj2QaHVSXQHj9"; // USDA's plan

// 1. Filter plan
const selectedPlan = plan.find((p) => p.id === PLAN_ID);

// 2. Filter related goals
const relatedGoals = goal.filter((g) => Array.isArray(g.plan) && g.plan.includes(PLAN_ID));
const relatedGoalIds = relatedGoals.map((g) => g.id);

// 3. Filter related objectives
const relatedObjectives = objective.filter((o) => Array.isArray(o.plan) && o.plan.includes(PLAN_ID));
const relatedObjectiveIds = relatedObjectives.map((o) => o.id);

// 4. Filter related metrics
const relatedMetrics = metric.filter((m) => Array.isArray(m.plan) && m.plan.includes(PLAN_ID));
const relatedMetricIds = relatedMetrics.map((m) => m.id);

// 5. Filter related projects
const relatedProjects = project.filter((p) => Array.isArray(p.plan) && p.plan.includes(PLAN_ID));
const relatedProjectIds = relatedProjects.map((p) => p.id);

// 6. Service Providers & Services (by org, project, or explicit relation)
const usdaOrgId = selectedPlan?.org?.[0];
const relatedServiceProviders = serviceProvider.filter((sp) => sp.org && sp.org.includes(usdaOrgId));
const relatedServiceProviderIds = relatedServiceProviders.map((sp) => sp.id);
const relatedServices = service.filter((s) => s.serviceProvider && s.serviceProvider.some((spid) => relatedServiceProviderIds.includes(spid)));

// 7. FPI Programs (by strategicObjective field)
const relatedFpiPrograms = fpiProgram.filter(
  (fp) => Array.isArray(fp.strategicObjective) && fp.strategicObjective.some((oid: string) => relatedObjectiveIds.includes(oid))
);

export default function DiscoverPage() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-12">
      {/* Strategic Plan Metadata */}
      {selectedPlan && (
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{selectedPlan.name} <span className="text-base font-normal text-gray-500">({selectedPlan.orgAcronym?.[0]})</span></h1>
              <div className="text-gray-700 text-sm mb-2">{selectedPlan.orgName?.[0]}</div>
              <div className="text-gray-500 text-xs">{selectedPlan.startDate} – {selectedPlan.endDate}</div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm mt-2 md:mt-0">
              <div><span className="font-semibold">Goals:</span> {selectedPlan.goalCount}</div>
              <div><span className="font-semibold">Objectives:</span> {selectedPlan.objectiveCount}</div>
              <div><span className="font-semibold">Metrics:</span> {selectedPlan.metricCount}</div>
              <div><span className="font-semibold">Projects:</span> {selectedPlan.projectCount}</div>
              <div><span className="font-semibold">Status:</span> {selectedPlan.status}</div>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard by Goal */}
      <section>
        {relatedGoals.map((goal, idx) => {
          const goalObjectives = relatedObjectives.filter((o) => Array.isArray(o.goal) && o.goal.includes(goal.id));
          const goalMetrics = relatedMetrics.filter((m) => Array.isArray(m.goal) && m.goal.includes(goal.id));
          const goalProjects = relatedProjects.filter((p) => Array.isArray(p.goal) && p.goal.includes(goal.id));

          return (
            <React.Fragment key={goal.id}>
              {idx !== 0 && (
                <div className="h-3 bg-gray-300 rounded my-8" aria-hidden="true" />
              )}
              <div className="mb-12">
                <div className="mb-4 border-b pb-2">
                  <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                    {goal.name}
                    <span className="text-base font-normal text-gray-500">{goal.subtitle}</span>
                  </h2>
                  <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-4">
                    <span>Objectives: {goal.objectiveCount}</span>
                    <span>Metrics: {goal.metricCount}</span>
                    <span>Projects: {goal.projectCount}</span>
                  </div>
                </div>

                {/* Objectives under this goal */}
                <Accordion type="multiple" className="space-y-4">
                  {goalObjectives.map((obj) => {
                    const objMetrics = relatedMetrics.filter((m) => Array.isArray(m.objective) && m.objective.includes(obj.id));
                    const objProjects = relatedProjects.filter((p) => Array.isArray(p.objective) && p.objective.includes(obj.id));
                    const objFpiPrograms = relatedFpiPrograms.filter((fp) => Array.isArray(fp.strategicObjective) && fp.strategicObjective.includes(obj.id));

                    return (
                      <AccordionItem key={obj.id} value={obj.id} className="bg-gray-50 rounded-lg border border-gray-200">
                        <AccordionTrigger>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                            <div>
                              <span className="text-lg font-semibold text-blue-800">{obj.name}</span>
                              <span className="block text-xs text-gray-600">Metrics: {obj.metricCount}, Projects: {obj.projectCount}</span>
                            </div>
                            {obj.goalName && (
                              <span className="text-xs text-gray-500 mt-2 md:mt-0">Goal: {obj.goalName[0]}</span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {/* Metrics for this objective */}
                          {objMetrics.length > 0 && (
                            <div className="mb-2">
                              <div className="font-semibold text-sm mb-1">Metrics</div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {objMetrics.map((m) => (
                                  <li key={m.id} className="bg-white rounded shadow p-3 border border-gray-100">
                                    <div className="font-semibold text-blue-700 text-sm">{m.name}</div>
                                    <div className="text-xs text-gray-600">Most Recent: {m.mostRecentResultFormatted ?? "N/A"} (Target: {m.mostRecentTargetResultFormatted ?? "N/A"})</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Projects for this objective */}
                          {objProjects.length > 0 && (
                            <div className="mb-2">
                              <div className="font-semibold text-sm mb-1">Projects</div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {objProjects.map((p) => (
                                  <li key={p.id} className="bg-white rounded shadow p-3 border border-gray-100">
                                    <div className="font-semibold text-blue-700 text-sm">{p.name}</div>
                                    <div className="text-xs text-gray-600">Milestones: {p.milestoneCount}</div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* FPI Programs for this objective */}
                          {objFpiPrograms.length > 0 && (
                            <div className="mt-2">
                              <div className="font-semibold text-sm mb-1">FPI Programs</div>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {objFpiPrograms.map((fp) => (
                                  <li key={fp.id} className="bg-white rounded shadow p-3 border border-gray-100">
                                    <div className="font-semibold text-blue-700 text-sm">{fp.title || fp.name}</div>
                                    <div className="text-xs text-gray-600">{fp.agency}</div>
                                    {fp.efficacyRate !== undefined && (
                                      <div className="text-xs">Efficacy Rate: {Math.round(fp.efficacyRate * 100)}%</div>
                                    )}
                                    <div className="text-xs text-gray-500 mb-1">{fp.objective || fp.description || "No description available."}</div>
                                    <div className="flex flex-wrap gap-2">
                                      {fp.grants_url && (
                                        <a href={fp.grants_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Grants.gov</a>
                                      )}
                                      {fp.usaspending_url && (
                                        <a href={fp.usaspending_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">USAspending</a>
                                      )}
                                      {fp.sam_url && (
                                        <a href={fp.sam_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">SAM.gov</a>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            </React.Fragment>
          );
        })}
      </section>

      {/* Service Providers & Services at the bottom */}
      <section>
        <h2 className="text-lg font-bold mb-2 mt-12">Service Providers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedServiceProviders.map((sp) => (
            <div key={sp.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="font-semibold text-blue-800 mb-1">{sp.name}</div>
              <div className="text-xs text-gray-600 mb-2">{sp.description}</div>
              <div className="text-xs text-gray-500">Services: {sp.service?.length ?? 0}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-2 mt-12">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedServices.map((s) => (
            <div key={s.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
              <div className="font-semibold text-blue-800 mb-1">{s.name}</div>
              <div className="text-xs text-gray-600 mb-2">{s.description}</div>
              <div className="text-xs text-gray-500 mb-1">Customers: {s.customerCount ?? "N/A"}, Satisfaction: {s.satisfactionRate ? `${Math.round(s.satisfactionRate * 100)}%` : "N/A"}</div>
              {s.website && (
                <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Learn more</a>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}