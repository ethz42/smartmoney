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
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            {/* 例如显示全部 column_names */}
            {data.metadata.column_names.map(col => (
              <th key={col} className="border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.rows.map((row, rowIndex) => (
            <tr 
              key={row.address || rowIndex}
              className={onSelectAddress ? "hover:bg-gray-100 cursor-pointer" : ""}
              onClick={() => onSelectAddress?.(row.address)}
              onKeyUp={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
              onKeyDown={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
              onKeyPress={(e) => e.key === 'Enter' && onSelectAddress?.(row.address)}
            >
              {/* 逐列渲染 */}
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.address}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.avg_buy_price}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.price_threshold}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.realized_multiple}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.realized_pnl_usd}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.total_bought_amount}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.total_buy_usd}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.total_sell_usd}</td>
              <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{row.total_trades}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* 底部可以显示统计信息 */}
          <tr>
            <td colSpan={data.metadata.column_names.length} className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm leading-4 font-medium text-gray-500 uppercase tracking-wider text-center">
              {data.metadata.total_row_count && `Total rows: ${data.metadata.total_row_count} `}
              {data.metadata.result_set_bytes && `Result size: ${Math.round(data.metadata.result_set_bytes / 1024)} KB`}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}