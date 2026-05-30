'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { StepIndicator } from '../../components/layout/StepIndicator';
import { FileUp, File, X, Briefcase, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { validateFiles } from '../../lib/utils/fileValidation';
import { formatFileSize } from '../../lib/utils/formatters';
import { toast } from 'sonner';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jdText, setJdText] = useState('');
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Prevent duplicates
    const newFiles = acceptedFiles.filter(
      (newFile) => !files.some((f) => f.name === newFile.name && f.size === newFile.size)
    );

    const merged = [...files, ...newFiles];
    const validation = validateFiles(merged);

    if (!validation.valid) {
      validation.errors.forEach((err) => toast.error(err));
      return;
    }

    setFiles(merged);
    if (newFiles.length > 0) {
      toast.success(`Added ${newFiles.length} resume file(s)`);
    }
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 20,
  });

  const removeFile = (index: number) => {
    const updated = [...files];
    const removedName = updated[index].name;
    updated.splice(index, 1);
    setFiles(updated);
    toast.info(`Removed ${removedName}`);
  };

  const handleStartScreening = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      toast.error('Please enter a job title');
      return;
    }
    if (!jdText.trim()) {
      toast.error('Please provide a job description');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one candidate resume');
      return;
    }

    try {
      setUploading(true);
      toast.info('Extracting text and parsing resumes...');

      // Step 1: Upload and parse resumes to text on server
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to parse resumes');
      }

      const data = await res.json();

      // Step 2: Store text payloads in localStorage for analyze state transfer
      localStorage.setItem('screeningResumes', JSON.stringify(data.resumes));
      localStorage.setItem('screeningJd', jdText);
      localStorage.setItem('screeningJobTitle', jobTitle);

      toast.success('Resumes parsed successfully! Initializing AI scoring...');
      router.push('/analyze');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'An error occurred during resume uploads');
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl flex-1 flex flex-col justify-start">
      <StepIndicator currentStep={1} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Create New Candidate Screening</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl mx-auto">
          Upload up to 20 candidate resumes in PDF/DOC/DOCX formats, specify the target position details, and start screening.
        </p>
      </div>

      <form onSubmit={handleStartScreening} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Job Details */}
        <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
              <Briefcase className="h-5 w-5" />
              Position Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Job Title / Target Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Fullstack React Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full h-11 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all font-semibold"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Job Description / Requirements
                </label>
                <textarea
                  placeholder="Paste details, requirements, stack, and preferred candidate skills..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full h-64 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all font-medium resize-none"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Resumes File Uploads */}
        <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4">
              <FileText className="h-5 w-5" />
              Candidate Resumes
            </h2>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/20'
              }`}
            >
              <input {...getInputProps()} />
              <FileUp className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-bold tracking-tight mb-1">Drag & drop files here</p>
              <p className="text-xs text-zinc-400 font-medium mb-3">or click to browse local files</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                PDF, DOCX, or DOC (Max 10MB per file)
              </p>
            </div>

            {/* Upload Limit Advice */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-2 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
              <AlertCircle className="h-4 w-4 text-zinc-400 flex-shrink-0" />
              Supports up to 20 candidate files parsed concurrently
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="mt-6 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Uploaded Files ({files.length})
                </label>
                {files.map((file, index) => (
                  <div
                    key={file.name + index}
                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 rounded-lg">
                        <File className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate pr-2 leading-tight">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold mt-0.5 leading-none">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Big CTAs */}
        <div className="col-span-1 md:col-span-2 pt-4">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-blue-600 text-white font-extrabold text-base rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Parsing Resumes...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-pulse" />
                Start AI Candidate Ranking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
