import { useState } from 'react';
import type { ReactNode } from 'react';
import { Lightbulb, Target, AlertTriangle, TrendingUp, CheckCircle, Code, Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import type { IdeaResponse } from '../App';

interface ResultDashboardProps {
  data: IdeaResponse;
}

export function ResultDashboard({ data }: ResultDashboardProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGeneratePrompt = () => {
    const promptData = {
      system_role: "You are an expert prototype developer and software architect.",
      task: "Generate a Proof of Concept (POC) technical implementation plan to build a minimum viable prototype based on the provided context.",
      context: {
        summary: data.summary,
        key_insights: data.insights,
        action_plan: data.actions,
        risks_to_mitigate: data.risks,
        opportunities_to_leverage: data.opportunities
      },
      instructions: [
        "Propose an appropriate minimal tech stack.",
        "Outline the core components required for the POC.",
        "Provide a step-by-step implementation guide.",
        "Include solutions for mitigating the listed risks."
      ]
    };
    setGeneratedPrompt(JSON.stringify(promptData, null, 2));
    setIsCopied(false);
  };

  const handleCopy = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
      
      {/* Summary spans full width */}
      <div className="md:col-span-2">
        <InsightCard 
          title="Summary" 
          icon={<Lightbulb className="text-yellow-400" size={24} />}
          className="border-yellow-500/20 shadow-yellow-500/10"
        >
          <p className="text-slate-300 leading-relaxed font-light">{data.summary}</p>
        </InsightCard>
      </div>

      <InsightCard 
        title="Key Insights" 
        icon={<Target className="text-blue-400" size={24} />}
        className="border-blue-500/20 shadow-blue-500/10"
      >
        <ListItems items={data.insights} />
      </InsightCard>

      <InsightCard 
        title="Action Plan" 
        icon={<CheckCircle className="text-emerald-400" size={24} />}
        className="border-emerald-500/20 shadow-emerald-500/10"
      >
        <ListItems items={data.actions} ordered />
      </InsightCard>

      <InsightCard 
        title="Risks & Challenges" 
        icon={<AlertTriangle className="text-red-400" size={24} />}
        className="border-red-500/20 shadow-red-500/10"
      >
        <ListItems items={data.risks} bulletColor="bg-red-400" />
      </InsightCard>

      <InsightCard 
        title="Opportunities" 
        icon={<TrendingUp className="text-purple-400" size={24} />}
        className="border-purple-500/20 shadow-purple-500/10"
      >
        <ListItems items={data.opportunities} bulletColor="bg-purple-400" />
      </InsightCard>

      {/* POC Prompt Generation Section */}
      <div className="md:col-span-2 mt-8">
        <div className="glass rounded-2xl p-6 border-indigo-500/20 shadow-indigo-500/10 transition-all duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-3">
              <span className="p-2 glass rounded-xl bg-slate-900/40">
                <Code className="text-indigo-400" size={24} />
              </span>
              Agent Handover
            </h3>
            <button
              onClick={handleGeneratePrompt}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 transform active:scale-95 text-sm font-medium"
            >
              Generate POC JSON Prompt
            </button>
          </div>

          {generatedPrompt && (
            <div className="mt-6 relative group">
              <div className="absolute right-3 top-3 z-10">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600/50 transition-all"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  <span className="text-xs font-medium">{isCopied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto text-sm text-indigo-200 font-mono">
                <code>{generatedPrompt}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, icon, children, className }: { title: string, icon: ReactNode, children: ReactNode, className?: string }) {
  return (
    <div className={cn("glass rounded-2xl p-6 transition-all duration-300 hover:bg-slate-800/60 hover:-translate-y-1", className)}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
        <span className="p-2 glass rounded-xl bg-slate-900/40">
          {icon}
        </span>
        {title}
      </h3>
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
}

function ListItems({ items, ordered = false, bulletColor = "bg-blue-400" }: { items: string[], ordered?: boolean, bulletColor?: string }) {
  if (!items || items.length === 0) return <p className="text-slate-500 italic">None identified.</p>;

  return (
    <ul className={cn("flex flex-col gap-3", ordered ? "list-decimal list-inside" : "")}>
      {items.map((item, idx) => (
        <li key={idx} className="flex gap-3 text-slate-300 font-light leading-relaxed items-start">
          {!ordered && (
            <div className={cn("mt-2 min-w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", bulletColor)} />
          )}
          {ordered && <span className="font-semibold text-slate-400 mt-0.5">{idx + 1}.</span>}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
