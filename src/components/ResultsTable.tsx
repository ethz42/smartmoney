import React from 'react';
import type { SearchResult } from '@/types/core/search';

interface ResultsTableProps {
  data: SearchResult;     // data.rows: SearchResultRow[]
  className?: string;
  onSelectAddress?: (address: string) => void;
}

export default function ResultsTable({ data, className, onSelectAddress }: ResultsTableProps) {
  // 简单安全检查
  if (!data || !data.rows || data.rows.length === 0) {
    return <div>No data to display</div>;
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-700/50 bg-gray-800/50 shadow-xl ${className}`}>
      <table className="min-w-full divide-y divide-gray-700/50">
        <thead>
          <tr>
            {data.metadata.column_names.map(col => (
              <th 
                key={col} 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider bg-gray-800/80"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {data.rows.map((row, rowIndex) => (
            <tr 
              key={row.address || rowIndex}
              className={`${onSelectAddress ? "hover:bg-gray-700/50 cursor-pointer transition-colors duration-150" : ""} group`}
              onClick={() => onSelectAddress?.(row.address)}
              onKeyUp={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
              onKeyPress={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-300 group-hover:text-purple-200">
                {row.address}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.avg_buy_price}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.price_threshold}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.realized_multiple}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.realized_pnl_usd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.total_bought_amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.total_buy_usd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.total_sell_usd}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {row.total_trades}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td 
              colSpan={data.metadata.column_names.length} 
              className="px-6 py-3 border-t border-gray-700/50 bg-gray-800/80 text-sm text-gray-400 text-center"
            >
              <div className="flex items-center justify-center gap-4">
                {data.metadata.total_row_count && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Total rows: {data.metadata.total_row_count}
                  </span>
                )}
                {data.metadata.result_set_bytes && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Size: {Math.round(data.metadata.result_set_bytes / 1024)} KB
                  </span>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}