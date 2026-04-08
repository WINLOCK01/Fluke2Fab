import { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;
    onSubmit(idea);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} className="text-blue-400" />
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="text-blue-400" size={24} />
          Share Your Idea
        </h2>
        <p className="text-slate-400 mb-6 font-light">
          Describe your thought, project, or brain-dump, and let the AI extract structured insights, risks, and an execution plan.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Build an app that tracks workouts using AI posture estimation..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all duration-300"
            rows={5}
            disabled={isLoading}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!idea.trim() || isLoading}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform active:scale-95",
                isLoading || !idea.trim()
                  ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  Generate Insights
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
