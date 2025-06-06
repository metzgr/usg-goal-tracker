"use client";

import React, { use } from 'react';
import goalData from '@/data/goal.json';
import Header from '@/components/custom/header';

interface Goal {
  id: string;
  name: string;
  status?: string;
  description?: string;
  plan?: string[];
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

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500 text-center">Further details and related items will be displayed here.</p>
          </div>
        </div>
      </div>
    </>
  );
}
