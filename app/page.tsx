'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, ListFilter, Trash2, ArrowRight, Eye, Briefcase, Users, Calendar } from 'lucide-react';
import { formatDate } from '../lib/utils/formatters';
import { toast } from 'sonner';

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
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 bg-gradient-to-b from-zinc-50 to-zinc-100/50 dark:from-zinc-950 dark:to-zinc-900/20 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/50 text-blue-700 text-xs font-bold mb-6 dark:bg-blue-900/30 dark:border-blue-800/30 dark:text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Next-Gen Resume Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Screen & Rank Candidates in Seconds with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              AI Precision
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 font-medium">
            Upload resumes, paste your job description, and let Claude extract skills, evaluate experience, and deliver a perfectly ranked candidate list instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upload"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Start Free Screening
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#sessions"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl active:scale-[0.98] transition-all border border-zinc-200 dark:border-zinc-700"
            >
              View Past Screenings
            </a>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white dark:bg-zinc-950 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{sessions.length}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Total Positions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">
                  {sessions.reduce((acc, s) => acc + s.candidatesCount, 0)}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Candidates Screened</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <ListFilter className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">100%</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Objective Rankings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions / Screening Dashboard Section */}
      <section id="sessions" className="py-16 px-6 container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Screening Dashboard</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Manage and review your historical AI evaluations</p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            New Screening
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">Loading screening history...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-zinc-900/10 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold tracking-tight mb-1">No past screenings found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
              You haven't screened any candidates yet. Get started by uploading resumes and entering a job description.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              Start First Screening
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/results?sessionId=${session.id}`}
                className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold dark:bg-zinc-800 dark:text-zinc-300">
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
                  <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 truncate">
                    {session.jobTitle}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-4 line-clamp-2">
                    {session.jdText}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-zinc-400" />
                    {session.candidatesCount} candidates
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    View Results
                    <Eye className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
