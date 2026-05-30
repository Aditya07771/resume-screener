'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StepIndicator } from '../../components/layout/StepIndicator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/dropdown-menu';
import { 
  FileText, Search, Sliders, Mail, Phone, Calendar, Download, Eye, 
  ChevronRight, AlertCircle, Award, CheckCircle2, User, HelpCircle, ArrowDownWideNarrow, ListRestart
} from 'lucide-react';
import { getScoreColor, getScoreBgColor, getRankBadgeColor, formatDate } from '../../lib/utils/formatters';
import { RankedCandidate, SessionWithCandidates } from '../../types';
import { toast } from 'sonner';

function ResultsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [session, setSession] = useState<SessionWithCandidates | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<RankedCandidate | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    if (sessionId) {
      fetchResults();
    } else {
      toast.error('No screening session specified.');
      router.push('/');
    }
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/results?sessionId=${sessionId}`);
      if (!res.ok) {
        throw new Error('Failed to retrieve screening results');
      }
      const data = await res.json();
      setSession(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error loading dashboard results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 text-center max-w-xl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-2">Generating Dashboard...</h2>
        <p className="text-zinc-500 text-sm font-semibold">Retrieving scored candidates and analysis metrics from Claude...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-6 py-20 text-center max-w-xl">
        <div className="p-4 bg-red-50 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Screening Results Not Found</h2>
        <p className="text-zinc-500 text-sm mb-6">The requested screening session details could not be found in the database.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  const { candidates } = session;

  // Compile unique skills list for filters
  const allMatchedSkillsSet = new Set<string>();
  candidates.forEach((c) => {
    c.matchedSkills.forEach((s) => allMatchedSkillsSet.add(s));
  });
  const allSkills = Array.from(allMatchedSkillsSet).sort();

  // Handle skills filters selection toggles
  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Filter candidates logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScore = c.matchScore >= minScore;

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((s) => c.matchedSkills.includes(s));

    return matchesSearch && matchesScore && matchesSkills;
  });

  // Derived metrics
  const avgScore = candidates.length > 0 
    ? Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length)
    : 0;

  const topMatch = candidates.length > 0 ? candidates[0] : null;

  const strongFitsCount = candidates.filter((c) => c.matchScore >= 75).length;

  const openCandidateDetails = (candidate: RankedCandidate) => {
    setSelectedCandidate(candidate);
    setDetailOpen(true);
  };

  const handleExport = (format: 'excel' | 'csv') => {
    toast.info(`Preparing ${format.toUpperCase()} export...`);
    window.open(`/api/export?sessionId=${session.id}&format=${format}`, '_blank');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setMinScore(0);
    setSelectedSkills([]);
    toast.info('Dashboard filters reset successfully');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl flex-1 flex flex-col justify-start">
      <StepIndicator currentStep={3} />

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8 mt-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5 leading-none">
            <Calendar className="h-4 w-4" />
            Created {formatDate(session.createdAt)}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1 text-gradient leading-tight">
            {session.jobTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">
            Objectively scored and ranked screening of {candidates.length} candidates
          </p>
        </div>

        {/* Actions panel */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push('/upload')}
            className="px-4 py-2.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 font-bold rounded-lg text-sm transition-all"
          >
            Screen More Candidates
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-sm shadow-lg shadow-blue-500/15 active:scale-[0.98] transition-all">
                <Download className="h-4 w-4" />
                Export Rankings
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1.5">
              <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer gap-2 font-semibold text-xs py-2 px-3">
                <FileText className="h-4 w-4 text-emerald-500" />
                Export to Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer gap-2 font-semibold text-xs py-2 px-3">
                <FileText className="h-4 w-4 text-blue-500" />
                Export to CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 border border-zinc-200/50 shadow-sm relative overflow-hidden dark:border-zinc-800/50">
          <div className="absolute top-4 right-4 text-zinc-300 dark:text-zinc-800">
            <User className="h-10 w-10 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 leading-none">Total Screened</p>
          <h3 className="text-3xl font-black tracking-tight">{candidates.length}</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold mt-2">Resume file payloads parsed</p>
        </Card>

        <Card className="p-5 border border-zinc-200/50 shadow-sm relative overflow-hidden dark:border-zinc-800/50">
          <div className="absolute top-4 right-4 text-zinc-300 dark:text-zinc-800">
            <Award className="h-10 w-10 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 leading-none">Average Score</p>
          <h3 className={`text-3xl font-black tracking-tight ${getScoreColor(avgScore)}`}>{avgScore}%</h3>
          <Progress value={avgScore} className="h-1.5 mt-3" />
        </Card>

        <Card className="p-5 border border-zinc-200/50 shadow-sm relative overflow-hidden dark:border-zinc-800/50">
          <div className="absolute top-4 right-4 text-yellow-400/20">
            <CheckCircle2 className="h-10 w-10 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 leading-none">Top Match Profile</p>
          <h3 className="text-lg font-bold truncate leading-snug mt-1 pr-10">
            {topMatch ? topMatch.name : 'N/A'}
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold mt-2.5">
            Rank #1 Match Score: {topMatch ? topMatch.matchScore : 0}%
          </p>
        </Card>

        <Card className="p-5 border border-zinc-200/50 shadow-sm relative overflow-hidden dark:border-zinc-800/50">
          <div className="absolute top-4 right-4 text-emerald-400/20">
            <ArrowDownWideNarrow className="h-10 w-10 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 leading-none">Strong Fits (≥75%)</p>
          <h3 className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-500">{strongFitsCount}</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold mt-2">Candidates match requirements</p>
        </Card>
      </div>

      {/* Main Grid: Filters Left, Candidates Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Panel Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 border border-zinc-200/80 shadow-sm bg-white dark:bg-zinc-900/50 dark:border-zinc-800/80">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 uppercase tracking-wide">
                <Sliders className="h-4 w-4 text-blue-600" />
                Filter Panel
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-zinc-400 hover:text-blue-600 font-bold uppercase tracking-wider flex items-center gap-0.5"
                title="Reset all filters"
              >
                <ListRestart className="h-3 w-3" />
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Search input */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Search Candidates
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search by name, skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Score Range slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Minimum Match Score
                  </label>
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                    {minScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-zinc-100 rounded-lg dark:bg-zinc-800"
                />
              </div>

              {/* Skills multi-select */}
              {allSkills.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    Filter by Skills
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {allSkills.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkillFilter(skill)}
                          className={`text-[10px] px-2 py-1 rounded-md font-semibold border transition-all ${
                            active
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10'
                              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Candidates List Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <span>Showing {filteredCandidates.length} of {candidates.length} Candidates</span>
            <span>Sorted by Rank</span>
          </div>

          {filteredCandidates.length === 0 ? (
            <Card className="p-16 text-center border border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/10">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold tracking-tight mb-1">No candidate matches found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
                No candidates match your current search queries or score ranges. Try relaxing your filter settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                Reset Filters
              </button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  onClick={() => openCandidateDetails(candidate)}
                  className="group p-5 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative border border-zinc-200/70 dark:border-zinc-800/70"
                >
                  <div className="flex gap-4 items-start min-w-0 flex-1">
                    {/* Rank Badge circle */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner shrink-0 ${getRankBadgeColor(candidate.rank)}`}>
                      #{candidate.rank}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none truncate pr-2">
                          {candidate.name}
                        </h3>
                        {candidate.experienceYears !== undefined && (
                          <Badge variant="outline" className="text-[10px] font-bold py-0 h-5 border-zinc-300 dark:border-zinc-700 text-zinc-500">
                            {candidate.experienceYears} Years Exp
                          </Badge>
                        )}
                        {candidate.education && (
                          <Badge variant="outline" className="text-[10px] font-bold py-0 h-5 max-w-[120px] truncate border-zinc-300 dark:border-zinc-700 text-zinc-500">
                            {candidate.education}
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-3 line-clamp-2 leading-relaxed">
                        {candidate.summary}
                      </p>

                      {/* Display matched skills snippet */}
                      <div className="flex flex-wrap gap-1">
                        {candidate.matchedSkills.slice(0, 5).map((skill) => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {candidate.matchedSkills.length > 5 && (
                          <span className="text-[9px] font-bold py-0.5 px-2 bg-zinc-100 text-zinc-500 rounded-md dark:bg-zinc-800 dark:text-zinc-400">
                            +{candidate.matchedSkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right hand score circular-looking tag */}
                  <div className="flex items-center justify-between sm:justify-end shrink-0 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-3 sm:pt-0 sm:border-0">
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Match Score</p>
                      <p className={`text-2xl font-black leading-none mt-1 ${getScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                      </p>
                      <p className="text-[9px] text-zinc-400 mt-1 font-bold">Objective analysis</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all hidden sm:block" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Evaluation Detail Dialog Modal */}
      {selectedCandidate && (
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl">
            <DialogHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${getRankBadgeColor(selectedCandidate.rank)}`}>
                  Rank #{selectedCandidate.rank}
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100`}>
                  Score: {selectedCandidate.matchScore}%
                </div>
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">{selectedCandidate.name}</DialogTitle>
              <DialogDescription className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-none">
                Screened against JD for {session.jobTitle} • {selectedCandidate.fileName}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="fit" className="w-full mt-4">
              <TabsList className="grid grid-cols-2 w-full max-w-sm mb-4">
                <TabsTrigger value="fit" className="font-semibold text-xs">AI Evaluation</TabsTrigger>
                <TabsTrigger value="resume" className="font-semibold text-xs">Plain Resume Text</TabsTrigger>
              </TabsList>

              {/* Tab 1: AI Evaluation */}
              <TabsContent value="fit" className="space-y-6 focus:outline-none">
                {/* Scoring breakdown grid */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 leading-none">Scoring Criteria Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-zinc-500">Skills Match</span>
                        <span className="text-blue-600">{selectedCandidate.scoreBreakdown.skillsMatch}/25</span>
                      </div>
                      <Progress value={(selectedCandidate.scoreBreakdown.skillsMatch / 25) * 100} className="h-1" />
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-zinc-500">Experience Relevance</span>
                        <span className="text-blue-600">{selectedCandidate.scoreBreakdown.experienceRelevance}/25</span>
                      </div>
                      <Progress value={(selectedCandidate.scoreBreakdown.experienceRelevance / 25) * 100} className="h-1" />
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-zinc-500">Education Alignment</span>
                        <span className="text-blue-600">{selectedCandidate.scoreBreakdown.educationAlignment}/25</span>
                      </div>
                      <Progress value={(selectedCandidate.scoreBreakdown.educationAlignment / 25) * 100} className="h-1" />
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                      <div className="flex justify-between items-center text-xs font-bold mb-1">
                        <span className="text-zinc-500">Keyword Similarity</span>
                        <span className="text-blue-600">{selectedCandidate.scoreBreakdown.keywordSimilarity}/25</span>
                      </div>
                      <Progress value={(selectedCandidate.scoreBreakdown.keywordSimilarity / 25) * 100} className="h-1" />
                    </div>
                  </div>
                </div>

                {/* Candidate Fit Summary */}
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-800/30 rounded-xl">
                  <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">AI Assessment Summary</h4>
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
                    "{selectedCandidate.summary}"
                  </p>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50/20 border border-green-200/30 rounded-xl">
                    <h4 className="text-xs font-extrabold text-green-700 dark:text-green-400 flex items-center gap-1 uppercase tracking-wider mb-2.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Matched Skills ({selectedCandidate.matchedSkills.length})
                    </h4>
                    {selectedCandidate.matchedSkills.length === 0 ? (
                      <p className="text-[10px] text-zinc-400 font-bold">No matching skills identified.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.matchedSkills.map((skill) => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 rounded-md border border-green-200/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50/20 border border-amber-200/30 rounded-xl">
                    <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1 uppercase tracking-wider mb-2.5">
                      <AlertCircle className="h-4 w-4" />
                      Missing Skills ({selectedCandidate.missingSkills.length})
                    </h4>
                    {selectedCandidate.missingSkills.length === 0 ? (
                      <p className="text-[10px] text-zinc-400 font-bold">No missing skills detected.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCandidate.missingSkills.map((skill) => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 rounded-md border border-amber-200/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidate Contact details */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs font-bold text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-zinc-400" />
                    {selectedCandidate.email || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-zinc-400" />
                    {selectedCandidate.phone || 'N/A'}
                  </span>
                </div>
              </TabsContent>

              {/* Tab 2: Plain Resume Text */}
              <TabsContent value="resume" className="focus:outline-none">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400 rounded-xl overflow-y-auto max-h-96 whitespace-pre-wrap font-mono font-medium">
                  {selectedCandidate.rawText}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-20 text-center max-w-xl">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-2">Generating Dashboard...</h2>
        <p className="text-zinc-500 text-sm font-semibold">Retrieving scored candidates and analysis metrics from Claude...</p>
      </div>
    }>
      <ResultsDashboard />
    </Suspense>
  );
}
