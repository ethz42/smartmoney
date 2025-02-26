export interface SearchResultRow {
  address: string;
  avg_buy_price: number;
  price_threshold: number;
  realized_multiple: number;
  realized_pnl_usd: number;
  total_bought_amount: number;
  total_buy_usd: number;
  total_sell_usd: number;
  total_trades: number;
}

export interface SearchResult {
  rows: SearchResultRow[];
  metadata: {
    column_names: string[];
    total_row_count?: number;
    result_set_bytes?: number;
  };
}