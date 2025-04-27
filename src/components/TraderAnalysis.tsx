'use client';

import { useState, useEffect } from 'react';
import { getTraderAnalysisAction } from '@/app/api/action';

interface TraderAnalysisProps {
  address: string | null;
}

export default function TraderAnalysis({ address }: TraderAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  useEffect(() => {
    async function fetchAnalysis() {
      if (!address) {
        setAnalysis(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getTraderAnalysisAction(address);
        if (result.success && result.data) {
          setAnalysis(result.data.description);
          setIsFromCache(result.data.isFromCache);
        } else {
          setError(result.error || '获取分析失败');
        }
      } catch (err) {
        setError('获取分析时发生错误');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [address]);

  if (!address) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-800/50 rounded-xl border border-gray-700/50 p-8">
        <div className="text-center space-y-3">
          <svg className="w-12 h-12 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">请选择一个地址查看分析</p>
          <p className="text-sm text-gray-500">从表格中选择一个交易者地址以查看详细分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 h-full overflow-auto shadow-xl">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">交易者分析</h3>
        </div>
        {isFromCache && (
          <span className="text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/20 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            缓存数据
          </span>
        )}
      </div>
      
      <div className="mb-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>地址</span>
        </div>
        <span className="text-gray-200 font-mono text-sm break-all">{address}</span>
      </div>
      
      {loading ? (
        <div className="py-8 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700/50 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-700/50 rounded-lg" />
            <div className="h-4 bg-gray-700/50 rounded-lg w-5/6" />
            <div className="h-4 bg-gray-700/50 rounded-lg w-2/3" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-red-300 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {analysis ? (
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 leading-relaxed whitespace-pre-line">{analysis}</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>无分析数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 