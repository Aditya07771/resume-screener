'use client';

import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Upload',
    description: 'Resumes & JD',
  },
  {
    number: 2,
    title: 'Analyze',
    description: 'AI evaluation',
  },
  {
    number: 3,
    title: 'Results',
    description: 'Ranked candidates',
  },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 z-0" />
        
        {/* Active connector line progress */}
        <div 
          className="absolute top-6 left-0 h-1 bg-blue-600 dark:bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ 
            width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' 
          }}
        />

        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center z-10 relative flex-1">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-500 ease-in-out shadow-sm",
                currentStep > step.number
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.number
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                  : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
              )}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="mt-3 text-center">
              <p className={cn(
                "text-sm font-bold tracking-tight",
                currentStep >= step.number ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'
              )}>
                {step.title}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
