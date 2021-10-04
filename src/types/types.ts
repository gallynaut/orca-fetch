export interface OrcaPoolStats {
  name: string;
  account: string;
  mint_account: string;
  liquidity: number;
  price: number;
  apy_24h?: number;
  apy_7d?: number;
  apy_30d?: number;
  volume_24h?: number;
  volume_24h_quote?: number;
  volume_7d?: number;
  volume_7d_quote?: number;
  volume_30d?: number;
  volume_30d_quote?: number;
}

interface Timeframes {
  day: string;
  week: string;
  month: string;
}

export interface OrcaFarmStats {
  poolId: string;
  poolAccount: string;
  tokenAAmount: string;
  tokenBAmount: string;
  poolTokenSupply: string;
  apy: Timeframes;
  volume: Timeframes;
  riskLevel: string;
  riskLevelVolatility: string;
  riskLevelModifiedTime: string;
}
