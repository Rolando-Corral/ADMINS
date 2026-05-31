export interface PortfolioSnapshot {
  id: string;
  createdAt: string;
  assets: SnapshotAsset[];
}

export interface SnapshotAsset {
  assetId: string;
  countName: string;
  shares: number;
  marketValueUsd: number;
  positionValueUsd: number;
}
