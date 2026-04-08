import { useState } from 'react';
import axios from 'axios';
import { IdeaInput } from './components/IdeaInput';
import { ResultDashboard } from './components/ResultDashboard';
import { BrainCircuit } from 'lucide-react';

export interface IdeaResponse {
  summary: string;
  insights: string[];
  actions: string[];
  risks: string[];
  opportunities: string[];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdeaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post<IdeaResponse>('http://localhost:8000/analyze', {
        user_input: idea
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "An unexpected error occurred while analyzing your idea.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 px-4 pb-20 selection:bg-blue-500/30">
      <header className="max-w-4xl mx-auto mb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-6 shadow-blue-500/10">
          <BrainCircuit size={40} className="text-blue-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 mb-6 drop-shadow-sm">
          GenAI Thought Companion
        </h1>
        <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
          Convert your raw ideas into structured insights, action plans, and risk assessments instantly.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <IdeaInput onSubmit={handleAnalyze} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-3xl mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center glass">
            {error}
          </div>
        )}

        {result && <ResultDashboard data={result} />}
      </main>
    </div>
  );
}

export default App;
