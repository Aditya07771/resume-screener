'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, Plus, ListFilter, Trash2, ArrowRight, Eye, Briefcase, 
  Users, Calendar, Search, Sparkles, Filter, CheckCircle2, AlertCircle, 
  HelpCircle, Check, ArrowDownWideNarrow, Play, ShieldCheck, Mail, Phone,
  Building2, ExternalLink, Globe, Send
} from 'lucide-react';
import { formatDate } from '../lib/utils/formatters';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';

interface HistoricalSession {
  id: string;
  createdAt: string;
  jobTitle: string;
  jdText: string;
  candidatesCount: number;
}

export default function Home() {
  const [sessions, setSessions] = useState<HistoricalSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to load past sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this screening session? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/sessions?sessionId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Screening session deleted successfully');
        setSessions(sessions.filter((s) => s.id !== id));
      } else {
        toast.error('Failed to delete screening session');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the session');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-28 px-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-950 text-center border-b border-zinc-100 dark:border-zinc-900 overflow-hidden">
        {/* Glow grid lines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0" />

        <div className="container mx-auto max-w-5xl relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/40 text-blue-700 text-xs font-bold dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
            AI-POWERED SHORTLISTING
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-zinc-900 dark:text-zinc-50 uppercase max-w-4xl mx-auto font-sans">
            AI Resume Screening That Shortlists Candidates in Seconds
          </h1>

          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
            Upload resumes, add a job description, and let AI find your perfect match while you focus on the interview. Automatically rank by skills, experience, and context.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-xl shadow-lg active:scale-[0.98] transition-all dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Start Screening
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#sessions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 font-extrabold rounded-xl active:scale-[0.98] transition-all border border-zinc-200 dark:border-zinc-800"
            >
              View Demo
            </a>
          </div>

          {/* Sub CTA support text */}
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
            90%+ adoption from week one • No lock-in • 100% Objective
          </p>

          {/* Recruiter Recruiter Dashboard Mockup Card */}
          <div className="pt-12 max-w-4xl mx-auto relative group">
            {/* Soft decorative shadow wrapper */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-25 transition-opacity" />
            
            {/* The Dashboard Card Container */}
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl text-left overflow-hidden">
              
              {/* Mockup header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2.5">
                  {/* Traffic lights */}
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-3">
                    AI RANKING ENGINE - SENIOR DEV
                  </span>
                </div>
                <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Mockup Quick Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="p-5 border-r border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">TOTAL CVS</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">842</span>
                    <Search className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                </div>
                <div className="p-5 border-r border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">TOP MATCHES</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-500">42</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase">Score &gt; 85%</span>
                  </div>
                </div>
                <div className="p-5 border-r border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">AVG MATCH</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-500">62%</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">BIAS CHECK</span>
                  <div className="flex justify-between items-baseline mt-1">
                    <span className="text-2xl font-black tracking-tight text-zinc-800 dark:text-zinc-100">Passed</span>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Mockup Ranked Candidates List */}
              <div className="p-6 bg-white dark:bg-zinc-900 space-y-3.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  <span>RANKED CANDIDATES</span>
                  <span>View All &gt;</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center font-bold text-xs">#1</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate leading-tight">Alexander King</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 uppercase tracking-wide">98% Match • 8 yrs Exp - React/Node</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2">Top Pick</Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">#2</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate leading-tight">Priya Sharma</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 uppercase tracking-wide">94% Match • 6 yrs Exp - AWS/Java</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">Highly Likely</Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">#3</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate leading-tight">John O'Conner</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 uppercase tracking-wide">88% Match • 10 yrs Exp - Architecture</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">Qualified</Badge>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">#4</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate leading-tight">Sarah Smith</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 uppercase tracking-wide">82% Match • 4 yrs Exp - Fullstack</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2 bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">Potential</Badge>
                </div>
              </div>
            </div>

            {/* Trusted Badge floating below mockup card */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 py-2.5 px-4 bg-zinc-900 text-white rounded-full shadow-xl border border-zinc-800 text-[11px] font-bold z-25 dark:bg-white dark:text-zinc-950 dark:border-zinc-200">
              <div className="flex -space-x-2">
                <span className="w-5 h-5 rounded-full bg-zinc-300 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-800 font-bold dark:border-white">👩🏻</span>
                <span className="w-5 h-5 rounded-full bg-zinc-400 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-800 font-bold dark:border-white">🧔🏼</span>
                <span className="w-5 h-5 rounded-full bg-zinc-500 border-2 border-zinc-900 flex items-center justify-center text-[9px] text-zinc-800 font-bold dark:border-white">👱🏻‍♀️</span>
              </div>
              <span className="flex items-center gap-1">
                Trusted for bias-free hiring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How AI Shortlisting Works Section */}
      <section className="py-24 px-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto max-w-5xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              How AI Shortlisting Works
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
              Turn a pile of resumes into a ranked list of top talent instantly. ResumeRank uses advanced semantic matching to understand skills in context, rather than just counting keywords.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div>
                <div className="p-3 bg-zinc-900 text-white rounded-xl w-fit dark:bg-zinc-100 dark:text-zinc-950 mb-6 shadow-md shadow-zinc-900/10">
                  <Filter className="h-5 w-5" />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider mb-2 leading-tight">1. Resume Parsing</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                  The system reads resumes in PDF, DOC, or DOCX formats, extracting key data like skills, experience, and education into structured, queryable fields instantly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div>
                <div className="p-3 bg-zinc-900 text-white rounded-xl w-fit dark:bg-zinc-100 dark:text-zinc-950 mb-6 shadow-md shadow-zinc-900/10">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider mb-2 leading-tight">2. Contextual Matching</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                  It doesn't just look for keywords. Our LLM understands that "React.js" and "ReactJS" are the same, and that "Senior Dev" implies specific leadership experience and technical depth.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <div>
                <div className="p-3 bg-green-500 text-white rounded-xl w-fit mb-6 shadow-md shadow-green-500/10">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-black uppercase tracking-wider mb-2 leading-tight">3. Instant Ranking</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                  Candidates are assigned a match score (e.g., 92%). Recruiters can immediately focus their time on the top 10% of applicants instead of reading every single file.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROI / Benefits Section */}
      <section className="py-24 px-6 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto max-w-4xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              AI Sourcing ROI
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
              The impact of automated screening on recruiter productivity.
            </p>
          </div>

          <Card className="p-8 border border-zinc-200/80 shadow-lg bg-white dark:bg-zinc-900/50 dark:border-zinc-800/80 rounded-3xl space-y-8 relative overflow-hidden">
            {/* Background design glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

            {/* ROI Item 1: Speed */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-black flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Resume Processing Speed
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">INSTANT SHORTLISTING</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                  <span>MANUAL METHOD</span>
                  <span>50 / DAY</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <div className="w-[10%] h-full bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                </div>
                <div className="flex justify-between text-[11px] font-extrabold text-blue-600 dark:text-blue-400 pt-1">
                  <span>RESUMERANK AI</span>
                  <span>UNLIMITED</span>
                </div>
                <div className="w-full h-2 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                  <div className="w-full h-full bg-blue-600 dark:bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* ROI Item 2: Bias */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-black flex items-center gap-1.5 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Shortlisting Bias Risk
                </h3>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">MERITOCRATIC HIRING</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-zinc-400">
                  <span>MANUAL METHOD</span>
                  <span>HIGH EFFORT</span>
                </div>
                <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <div className="w-[75%] h-full bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                </div>
                <div className="flex justify-between text-[11px] font-extrabold text-blue-600 dark:text-blue-400 pt-1">
                  <span>RESUMERANK AI</span>
                  <span>MINIMAL (BLIND)</span>
                </div>
                <div className="w-full h-2 bg-blue-50 dark:bg-blue-950/20 rounded-full">
                  <div className="w-[8%] h-full bg-blue-600 dark:bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Bottom info link */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Check className="h-4.5 w-4.5 text-emerald-500" />
                Verified Efficiency Benchmarks
              </span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Comparison Benchmarks Section */}
      <section className="py-24 px-6 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <div className="container mx-auto max-w-4xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              AI Shortlisting Efficiency Benchmarks
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
              Manually screening a high volume of resumes leads to recruiter fatigue and the high probability of missing top-tier talent buried at the bottom of the stack.
            </p>
          </div>

          <Card className="border border-zinc-200/85 dark:border-zinc-800/85 rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-zinc-900/50">
            {/* Table Header Card block */}
            <div className="bg-zinc-900 dark:bg-zinc-900 px-6 py-4 border-b border-zinc-800 dark:border-zinc-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                AI SHORTLISTING EFFICIENCY BENCHMARKS
              </h3>
            </div>
            
            {/* Structured Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <th className="px-6 py-4">SCREENING TASK</th>
                    <th className="px-6 py-4">MANUAL RECRUITER</th>
                    <th className="px-6 py-4 text-blue-600 dark:text-blue-400">RESUMERANK ENGINE</th>
                    <th className="px-6 py-4 text-emerald-600 dark:text-emerald-500">ADVANTAGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-black">Time per Resume</td>
                    <td className="px-6 py-4 text-zinc-500">5-10 Minutes</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-extrabold">0.2 Seconds</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-500 font-extrabold">100x Speedup</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-black">Match Logic</td>
                    <td className="px-6 py-4 text-zinc-500">Subjective / Biased</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-extrabold">Semantic (Skill-based)</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-500 font-extrabold">Better Diversity</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-black">Accuracy (Niche roles)</td>
                    <td className="px-6 py-4 text-zinc-500">Varies by recruiter exp</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-extrabold">Consistently High</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-500 font-extrabold">Reliable Ranking</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-black">Screening Cost</td>
                    <td className="px-6 py-4 text-zinc-500">High (Labor intensive)</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-extrabold">Near Zero</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-500 font-extrabold">Scale with Ease</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="px-6 py-4 font-black">Diversity consistency</td>
                    <td className="px-6 py-4 text-zinc-500">Unconscious Bias</td>
                    <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-extrabold">Fully Standardized</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-500 font-extrabold">Fair & Equal</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-zinc-50/80 dark:bg-zinc-950 px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-semibold italic">
              Operational comparison between Manual CV Screening and ResumeRank AI Ranking Engine.
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Explainability & Trust Section */}
      <section className="py-24 px-6 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="container mx-auto max-w-4xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              Solving the "Resume Tsunami" with AI
            </h2>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
              The ease of "One-Click Apply" on modern job boards has created a paradox: while it's easier than ever to attract candidates, it's harder than ever to find the right one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Solving the Resume Triage Problem
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                A typical job opening for a popular role can attract hundreds, sometimes thousands, of applications. For a human recruiter, manually reviewing every CV is impossible. This leads to "CV fatigue," where qualified candidates are rejected simply because they were at the bottom of the pile.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Contextual Intelligence Over Keyword Matching
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                Traditional ATS parsers relied on simple keyword matching (e.g., counting how many times "Java" appears). This system was easily gamed by candidates who "stuffed" their resumes with keywords. ResumeRank uses next-generation Large Language Models (LLMs) to understand context.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                Reducing Unconscious Bias
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                Human hiring is inherently biased. We are unconsciously influenced by a candidate's name, university, or even the layout of their resume. By evaluating candidates objectively against the job description before a human ever sees the name, we help organizations build more diverse and meritocratic teams.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                AI as an Assistant, Not a Replacement
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                It is crucial to clarify that our AI does not make the hiring decision. It is a decision-support tool. It handles the high-volume, low-value task of initial screening, allowing your human recruiters to spend 100% of their time on high-value tasks: interviewing, relationship building, and culture assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Active Screening History Dashboard Section (Integrated seamlessly) */}
      <section id="sessions" className="py-24 px-6 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 scroll-mt-16">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Your Screening Sessions</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-1">Manage and review your historical candidate evaluations</p>
            </div>
            
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              New Screening
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">Loading screening history...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl text-center shadow-sm">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide mb-1">No screening sessions found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed font-semibold">
                You haven't screened any candidates yet. Get started by uploading resumes and entering a job description.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs rounded-xl shadow-lg active:scale-[0.98] transition-all dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                Create First Session
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/results?sessionId=${session.id}`}
                  className="group p-6 bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-extrabold uppercase tracking-wide dark:bg-zinc-800 dark:text-zinc-300">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(session.createdAt)}
                      </div>
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                        title="Delete screening session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-black group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 truncate">
                      {session.jobTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold mb-4 line-clamp-2 leading-relaxed">
                      {session.jdText}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                    <span className="text-xs font-black text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-zinc-400" />
                      {session.candidatesCount} candidates
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      View Results
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. Final CTA Banner Section */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-950 relative overflow-hidden">
        {/* Soft grid dots backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] z-0" />
        
        <div className="container mx-auto max-w-4xl relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase">
            Shortlist Faster with AI
          </h2>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-semibold leading-relaxed">
            Ready to accelerate your talent acquisition pipeline? Upload resumes and extract ranked shortlists instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-extrabold text-sm rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all"
            >
              Upload Resumes
            </Link>
            <a
              href="#sessions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-extrabold text-sm rounded-xl active:scale-[0.98] transition-all"
            >
              See Candidate Ranking
            </a>
          </div>
        </div>
      </section>

      {/* 8. Dark Modern Footer */}
      <footer className="bg-zinc-950 text-zinc-400 dark:bg-black dark:text-zinc-500 py-16 px-6 border-t border-zinc-900/50">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Logo column */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 font-bold text-white text-lg">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <span className="font-extrabold tracking-tight text-white">
                  ResumeRank AI
                </span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs font-semibold">
                An enterprise-grade, semantic AI recruiting assistant. Instantly parse, evaluate, and prioritize top candidate profiles with 100% objective, contextual intelligence.
              </p>
              <div className="flex items-center gap-3.5 pt-2 text-zinc-500">
                <a href="https://twitter.com" target="_blank" rel="noopener" className="hover:text-white transition-colors"><Send className="h-4.5 w-4.5" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener" className="hover:text-white transition-colors"><Building2 className="h-4.5 w-4.5" /></a>
                <a href="https://github.com" target="_blank" rel="noopener" className="hover:text-white transition-colors"><Globe className="h-4.5 w-4.5" /></a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><Link href="/upload" className="hover:text-white transition-colors">AI Shortlisting</Link></li>
                <li><a href="#sessions" className="hover:text-white transition-colors">Screening Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing Options</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise ATS</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-4">Features</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-white transition-colors">Semantic Parser</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blind Screening</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Match Breakdown</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Data Export (.xlsx)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1">HR University <ExternalLink className="h-3 w-3" /></a></li>
                <li><a href="#" className="hover:text-white transition-colors">Recruiting Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-900/50 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest gap-4">
            <span>© 2026 ResumeRank AI Inc. All Rights Reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
