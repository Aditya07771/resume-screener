'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StepIndicator } from '../../components/layout/StepIndicator';
import { Sparkles, BrainCircuit, Activity, Award } from 'lucide-react';
import { toast } from 'sonner';

const statuses = [
  'Initializing AI evaluation engine...',
  'Extracting technical skills from resumes...',
  'Cross-referencing candidate education matches...',
  'Measuring domain relevance and experience years...',
  'Assimilating key industry terms and keywords...',
  'Evaluating past professional achievements...',
  'Compiling score breakdowns from Claude...',
  'Sorting and ranking overall candidate profiles...',
  'Writing records to local database...',
  'Finalizing ranked rankings...',
];

export default function AnalyzePage() {
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const analyzeTriggered = useRef(false);

  useEffect(() => {
    // Increment loading statuses sequentially
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 3000);

    // Dynamic progress bar incrementing
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) {
          // Slow down progress as it nears 95%
          const increment = Math.max(1, Math.floor((100 - prev) / 10));
          return prev + increment;
        }
        return prev;
      });
    }, 1200);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  useEffect(() => {
    if (analyzeTriggered.current) return;
    analyzeTriggered.current = true;
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      const resumes = localStorage.getItem('screeningResumes');
      const jdText = localStorage.getItem('screeningJd');
      const jobTitle = localStorage.getItem('screeningJobTitle');

      if (!resumes || !jdText || !jobTitle) {
        toast.error('No screening details found. Redirecting to upload.');
        router.push('/upload');
        return;
      }

      const parsedResumes = JSON.parse(resumes);

      // Perform AI Analysis on API
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          jdText,
          resumes: parsedResumes,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'AI analysis failed');
      }

      const data = await res.json();

      // Clear local storage on success
      localStorage.removeItem('screeningResumes');
      localStorage.removeItem('screeningJd');
      localStorage.removeItem('screeningJobTitle');

      setProgress(100);
      toast.success('AI Screening completed successfully!');
      
      // Delay slightly so user sees 100% completed
      setTimeout(() => {
        router.push(`/results?sessionId=${data.sessionId}`);
      }, 800);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred during AI evaluation');
      router.push('/upload');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl flex-1 flex flex-col justify-center">
      <StepIndicator currentStep={2} />

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center shadow-lg relative overflow-hidden mt-6">
        {/* Glow backdrop decorative layer */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          {/* Animated Spinner Icon Grid */}
          <div className="flex justify-center items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Spinning rings */}
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-indigo-500/15 rounded-full" />
              <div className="absolute inset-2 border-4 border-indigo-500 border-b-transparent rounded-full animate-spin [animation-duration:3s]" />
              
              <BrainCircuit className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-pulse z-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-bounce" />
              AI Scoring in Progress
            </h1>
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 min-h-[20px] transition-all duration-300">
              {statuses[statusIndex]}
            </p>
          </div>

          {/* Progress bar container */}
          <div className="space-y-2.5 max-w-md mx-auto">
            <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                Claude Evaluation
              </span>
              <span>{progress}%</span>
            </div>
            
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-200/50 dark:border-zinc-700/50">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 font-bold uppercase tracking-wider max-w-sm mx-auto">
            <Award className="h-4 w-4 text-blue-500 animate-pulse" />
            Scoring breakdown is strict & objective
          </div>
        </div>
      </div>
    </div>
  );
}
