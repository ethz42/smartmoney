import React from 'react';
import type { SearchResult } from '@/types/core/search';

interface ResultsTableProps {
  data: SearchResult;     // data.rows: SearchResultRow[]
  className?: string;
}

export default function ResultsTable({ data, className }: ResultsTableProps) {
  // 简单安全检查
  if (!data || !data.rows || data.rows.length === 0) {
    return <div>No data to display</div>;
  }

  return (
    <div className={className}>
      <table style={{ width: '100%', border: '1px solid gray' }}>
        <thead>
          <tr>
            {/* 例如显示全部 column_names */}
            {data.metadata.column_names.map(col => (
              <th key={col} style={{ borderBottom: '1px solid gray' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={row.address || rowIndex}>
              {/* 逐列渲染，也可以手动写死每个字段 */}
              <td>{row.address}</td>
              <td>{row.avg_buy_price}</td>
              <td>{row.price_threshold}</td>
              <td>{row.realized_multiple}</td>
              <td>{row.realized_pnl_usd}</td>
              <td>{row.total_bought_amount}</td>
              <td>{row.total_buy_usd}</td>
              <td>{row.total_sell_usd}</td>
              <td>{row.total_trades}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {/* 底部可以显示统计信息 */}
          <tr>
            <td colSpan={data.metadata.column_names.length}>
              {data.metadata.total_row_count && `Total rows: ${data.metadata.total_row_count} `}
              {data.metadata.result_set_bytes && `Result size: ${Math.round(data.metadata.result_set_bytes / 1024)} KB`}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}