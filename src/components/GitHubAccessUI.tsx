"use client";

import { useState } from "react";
import { Github, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { grantRepoAccess } from "@/actions/github-access";

interface GitHubAccessUIProps {
  productId: string;
  githubRepo: string;
  initialGithubUsername?: string | null;
}

export default function GitHubAccessUI({ productId, githubRepo, initialGithubUsername }: GitHubAccessUIProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(initialGithubUsername || "");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleGrantAccess = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    setStatus(null);

    const result = await grantRepoAccess(productId, username);

    if (result.error) {
        setStatus({ type: 'error', message: result.error as string });
    } else {
        setStatus({ type: 'success', message: result.message as string });
    }
    
    setIsLoading(false);
  };

  if (!isOpen) {
      return (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-700"
          >
              <Github className="w-4 h-4" />
              Get Repository Access
          </button>
      );
  }

  return (
    <div className="mt-3 bg-[#111118] border border-gray-700 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center justify-between mb-3">
             <h4 className="text-sm font-bold text-gray-200 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Access
             </h4>
             <button onClick={() => setIsOpen(false)} className="text-xs text-gray-500 hover:text-white">
                 Cancel
             </button>
        </div>

        <p className="text-xs text-gray-400 mb-3">
            Enter your GitHub username to be invited to <strong>{githubRepo}</strong>.
        </p>

        <div className="space-y-3">
            <input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GitHub Username"
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />

            {status && (
                <div className={`text-xs p-2 rounded-lg flex items-start gap-2 ${status.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {status.type === 'success' ? <CheckCircle className="w-3 h-3 mt-0.5" /> : <AlertCircle className="w-3 h-3 mt-0.5" />}
                    <span>{status.message}</span>
                </div>
            )}

            <button 
                onClick={handleGrantAccess}
                disabled={isLoading || !username}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Invite"}
            </button>
        </div>
    </div>
  );
}
