"use client";

"use client";

import React from "react";
import fpiProgram from "@/data/fpiProgram.json";
import goal from "@/data/goal.json";
import metric from "@/data/metric.json";
import metricResult from "@/data/metricResult.json";
import objective from "@/data/objective.json";
import plan from "@/data/plan.json";
import project from "@/data/project.json";
import service from "@/data/service.json";
import serviceProvider from "@/data/serviceProvider.json";
import milestone from "@/data/milestone.json";
import milestoneResult from "@/data/milestoneResult.json";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  SidebarProvider,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "./MetricCard";
import { PieChart, Pie, Cell } from "recharts";
import { ProjectCard } from "./ProjectCard";

const PLAN_ID = "recOMj2QaHVSXQHj9"; // USDA's plan
const selectedPlan = plan.find((p) => p.id === PLAN_ID);
const relatedGoals = goal.filter((g) => Array.isArray(g.plan) && g.plan.includes(PLAN_ID));
const relatedObjectives = objective.filter((o) => Array.isArray(o.plan) && o.plan.includes(PLAN_ID));
const relatedObjectiveIds = relatedObjectives.map((o) => o.id);
const relatedMetrics = metric.filter((m) => Array.isArray(m.plan) && m.plan.includes(PLAN_ID));
const relatedProjects = project.filter((p) => Array.isArray(p.plan) && p.plan.includes(PLAN_ID));
const relatedServiceProviders = serviceProvider.filter((sp) => sp.org && sp.org.includes(selectedPlan?.org?.[0]));
const relatedServices = service.filter((s) => s.serviceProvider && s.serviceProvider.some((spid) => relatedServiceProviders.map((sp) => sp.id).includes(spid)));
const relatedFpiPrograms = fpiProgram.filter((fp) => Array.isArray(fp.strategicObjective) && fp.strategicObjective.some((oid) => relatedObjectives.map((o) => o.id).includes(oid)));

export default function DiscoverPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar for Goals */}
        <Sidebar className="bg-muted/80 border-r w-64 hidden md:flex">
          <div className="p-4">
            <div className="font-bold text-lg mb-2">Goals</div>
            <SidebarMenu>
              {relatedGoals.map((g) => (
                <SidebarMenuItem key={g.id}>
                  <a href={`#goal-${g.id}`} className="block py-1 px-2 rounded hover:bg-muted transition-colors">
                    {g.name}
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background/80 backdrop-blur z-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">{selectedPlan?.orgAcronym?.[0] || "Org"}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedPlan?.name || "Plan"}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-col md:flex-row md:gap-8 p-4">
            {/* Mobile Sidebar */}
            <Sidebar className="bg-muted/80 border-r w-60 md:hidden mb-6">
              <div className="p-4">
                <div className="font-bold text-lg mb-2">Goals</div>
                <SidebarMenu>
                  {relatedGoals.map((g) => (
                    <SidebarMenuItem key={g.id}>
                      <a href={`#goal-${g.id}`} className="block py-1 px-2 rounded hover:bg-muted transition-colors">
                        {g.name}
                      </a>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            </Sidebar>
            {/* Main Content */}
            <main className="flex-1">
  <div className="max-w-5xl mx-auto p-6">
    <section className="mb-8">
      <h1 className="text-xl font-bold mb-1">{selectedPlan?.name} <span className="text-base font-normal text-gray-500">({selectedPlan?.orgAcronym?.[0]})</span></h1>
      <div className="text-gray-700 text-sm mb-2">{selectedPlan?.orgName?.[0]}</div>
                <div className="text-gray-500 text-xs mb-2">{selectedPlan?.startDate} – {selectedPlan?.endDate}</div>
                <div className="flex flex-wrap gap-2 text-sm mt-2">
  <Badge variant="outline">Goals: {selectedPlan?.goalCount}</Badge>
  <Badge variant="outline">Objectives: {selectedPlan?.objectiveCount}</Badge>
  <Badge variant="outline">Metrics: {selectedPlan?.metricCount}</Badge>
  <Badge variant="outline">Projects: {selectedPlan?.projectCount}</Badge>
  <Badge variant="outline">Programs: {relatedFpiPrograms.length}</Badge>
  <Badge variant="outline">Status: {selectedPlan?.status}</Badge>
</div>
              </section>
              <Separator className="my-6" />
              {/* Goals and Objectives */}
              {relatedGoals.map((goal) => {
                const goalObjectives = relatedObjectives.filter((o) => Array.isArray(o.goal) && o.goal.includes(goal.id));
                const goalMetrics = relatedMetrics.filter((m) => Array.isArray(m.goal) && m.goal.includes(goal.id));
                const goalProjects = relatedProjects.filter((p) => Array.isArray(p.goal) && p.goal.includes(goal.id));
                return (
                  <section key={goal.id} id={`goal-${goal.id}`} className="mb-12 scroll-mt-24 border-l-2 border-gray-900 pl-4">
                    <div className="mb-2">
  <h2 className="text-lg font-bold text-gray-900">{goal.name}</h2>
  {goal.subtitle && <div className="text-base font-normal text-gray-500 mb-2">{goal.subtitle}</div>}
</div>
                    <div className="text-xs text-gray-600 mb-4 flex gap-2">
                    <Badge variant="outline">Objectives: {goal.objectiveCount}</Badge>
                    <Badge variant="outline">Metrics: {goal.metricCount}</Badge>
                    <Badge variant="outline">Projects: {goal.projectCount}</Badge>
</div>

                    {/* Objectives Accordion */}
                    <Accordion type="multiple" className="">
  {goalObjectives.map((obj) => {
                        const objMetrics = relatedMetrics.filter((m) => Array.isArray(m.objective) && m.objective.includes(obj.id));
                        const objProjects = relatedProjects.filter((p) => Array.isArray(p.objective) && p.objective.includes(obj.id));
                        const objFpiPrograms = relatedFpiPrograms.filter((fp) => Array.isArray(fp.strategicObjective) && fp.strategicObjective.includes(obj.id));
                        return (
                          <AccordionItem key={obj.id} value={obj.id} className="bg-gray-50 py-0 px-3 shadow-none border-0 divide-y">
                            <AccordionTrigger>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                                <span className="text-[15px] font-medium text-gray-900">{obj.name}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              {/* Metrics for this objective */}
                              {objMetrics.length > 0 && (
  <div className="mb-2">
    <div className="font-semibold text-xs mb-3 uppercase pl-1.5 border-l-2 border-gray-900 mt-6">Metrics</div>
    <div className="">
      {objMetrics.map((m) => (
        <MetricCard
          key={m.id}
          metric={m}
          results={metricResult.filter((r) => Array.isArray(r.metric) && r.metric.includes(m.id))}
          compressed
        />
      ))}
    </div>
  </div>
)}
                              {/* Projects for this objective */}
                              {objProjects.length > 0 && (
                                <div className="mb-2">
                                    <div className="font-semibold text-xs mb-3 uppercase pl-1.5 border-l-2 border-gray-900 mt-6">Projects</div>
                                  <div className="">
  {objProjects.map((p) => (
    <ProjectCard
      key={p.id}
      project={p}
      milestoneResult={milestoneResult.filter((m) => Array.isArray(m.project) && m.project.includes(p.id))}
      milestoneCount={p.milestoneCount}
      compressed
    />
  ))}
</div>
                                </div>
                              )}
                              {/* FPI Programs for this objective */}
                              {objFpiPrograms.length > 0 && (
                                <div className="mt-2">
                                  <div className="font-semibold text-xs mb-3 uppercase pl-1.5 border-l-2 border-gray-900 mt-6">Contributing Programs</div>
                                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {objFpiPrograms.map((fp) => (
                                      <li key={fp.id} className="rounded bg-white p-3 border border-gray-100">
                                        <div className="font-medium text-sm text-gray-900">{fp.title || fp.name}</div>
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
                  </section>
                );
              })}
              <Separator className="my-10" />
              {/* Service Providers */}
              <section>
                <h2 className="text-lg font-bold mb-2 mt-12">Service Providers</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedServiceProviders.map((sp) => (
                    <li key={sp.id} className="rounded bg-white p-4 border border-gray-100">
                      <div className="font-semibold text-base text-gray-900 mb-1">{sp.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{sp.description}</div>
                      <div className="text-xs text-gray-500">Services: {sp.service?.length ?? 0}</div>
                    </li>
                  ))}
                </ul>
              </section>
              {/* Services */}
              <section>
                <h2 className="text-lg font-bold mb-2 mt-12">Services</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedServices.map((s) => (
                    <li key={s.id} className="rounded bg-white p-4 border border-gray-100">
                      <div className="font-semibold text-base text-gray-900 mb-1">{s.name}</div>
                      <div className="text-xs text-gray-600 mb-2">{s.description}</div>
                      <div className="text-xs text-gray-500 mb-1">Customers: {s.customerCount ?? "N/A"}, Satisfaction: {s.satisfactionRate ? `${Math.round(s.satisfactionRate * 100)}%` : "N/A"}</div>
                      {s.website && (
                        <a href={s.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Learn more</a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
                </div>
</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
    
  );
}
                   