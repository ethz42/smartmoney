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
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>请选择一个地址查看分析</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full overflow-auto">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">交易者分析</h3>
        {isFromCache && (
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
            缓存数据
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <span className="text-gray-400 text-sm">地址:</span>
        <span className="ml-2 text-gray-200 font-mono text-sm break-all">{address}</span>
      </div>
      
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-700 rounded" />
            <div className="h-4 bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-800/30 rounded-lg border border-red-600/50 text-red-300">
          ⚠️ {error}
        </div>
      ) : (
        <div className="mt-4 text-gray-200 leading-relaxed">
          {analysis ? (
            <p className="whitespace-pre-line">{analysis}</p>
          ) : (
            <p className="text-gray-400">无分析数据</p>
          )}
        </div>
      )}
    </div>
  );
} 