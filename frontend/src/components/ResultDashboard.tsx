import type { ReactNode } from 'react';
import { Lightbulb, Target, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { IdeaResponse } from '../App';

interface ResultDashboardProps {
  data: IdeaResponse;
}

export function ResultDashboard({ data }: ResultDashboardProps) {
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
