import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { PortfolioHistoryService } from 'src/app/core/services/portfolio-history/portfolio-history.service';
import { PortfolioSnapshot } from 'src/app/core/interfaces/portfolio-snapshot.model';

interface AssetTimeSeries {
  countName: string;
  data: (number | null)[];
}

@Component({
  selector: 'app-portfolio-history',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './portfolio-history.component.html',
  styleUrls: ['./portfolio-history.component.scss'],
})
export class PortfolioHistoryComponent implements OnInit {
  isLoading = true;
  hasData = false;

  snapshots: PortfolioSnapshot[] = [];

  allAssetNames: string[] = [];
  visibleAssets: Set<string> = new Set();
  labels: string[] = [];
  assetSeries: AssetTimeSeries[] = [];

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      line: { tension: 0.3 },
    },
  };

  chartType: ChartType = 'line';

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  private colors = [
    '#0d6efd', '#198754', '#ffc107', '#dc3545',
    '#6f42c1', '#fd7e14', '#20c997', '#e83e8c',
    '#0dcaf0', '#6610f2', '#d63384', '#adb5bd',
  ];

  constructor(private historyService: PortfolioHistoryService) {}

  ngOnInit(): void {
    this.loadSnapshots();
  }

  private loadSnapshots(): void {
    this.isLoading = true;
    this.historyService.getAll().subscribe({
      next: (snapshots) => {
        // this.snapshots = snapshots.length > 0 ? snapshots : this.getMockSnapshots();
        this.snapshots = snapshots;
        this.processSnapshots();
        this.isLoading = false;
      },
      error: () => {
        // this.snapshots = this.getMockSnapshots();
        this.processSnapshots();
        this.isLoading = false;
      },
    });
  }

  // private getMockSnapshots(): PortfolioSnapshot[] {
  //   const snapshots: PortfolioSnapshot[] = [];
  //   const start = new Date('2025-12-01');
  //   const symbols = ['AAPL', 'SPY', 'BTC', 'MSFT'];

  //   const basePrices: Record<string, number> = {
  //     AAPL: 180, SPY: 450, BTC: 75000, MSFT: 380,
  //   };
  //   const shares: Record<string, number> = {
  //     AAPL: 0.5, SPY: 0.2, BTC: 0.001, MSFT: 0.3,
  //   };

  //   for (let w = 0; w < 20; w++) {
  //     const date = new Date(start);
  //     date.setDate(date.getDate() + w * 7);

  //     const assets = symbols.map((name) => {
  //       const base = basePrices[name];
  //       const drift = (Math.random() - 0.35) * base * 0.08;
  //       const price = Math.max(base + drift * (w + 1) * 0.3, base * 0.6);
  //       const positionValue = price * shares[name];
  //       return {
  //         assetId: `${name.toLowerCase()}-mock`,
  //         countName: name,
  //         shares: shares[name],
  //         marketValueUsd: Math.round(price * 100) / 100,
  //         positionValueUsd: Math.round(positionValue * 100) / 100,
  //       };
  //     });

  //     snapshots.push({
  //       id: `mock-${w}`,
  //       createdAt: date.toISOString(),
  //       assets,
  //     });
  //   }

  //   return snapshots;
  // }

  private processSnapshots(): void {
    if (this.snapshots.length === 0) {
      this.hasData = false;
      return;
    }

    this.hasData = true;

    const sorted = [...this.snapshots].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    this.labels = sorted.map((s) => {
      const d = new Date(s.createdAt);
      return d.toLocaleDateString();
    });

    const assetNames = new Set<string>();
    sorted.forEach((s) => s.assets.forEach((a) => assetNames.add(a.countName)));
    this.allAssetNames = Array.from(assetNames).sort();
    this.visibleAssets = new Set(this.allAssetNames);

    this.assetSeries = this.allAssetNames.map((name) => {
      const data: (number | null)[] = sorted.map((snap) => {
        const asset = snap.assets.find((a) => a.countName === name);
        return asset ? asset.positionValueUsd : null;
      });
      return { countName: name, data };
    });

    this.buildChartData();
  }

  toggleAsset(name: string): void {
    if (this.visibleAssets.has(name)) {
      this.visibleAssets.delete(name);
    } else {
      this.visibleAssets.add(name);
    }
    this.buildChartData();
  }

  private buildChartData(): void {
    const filtered = this.assetSeries.filter((s) =>
      this.visibleAssets.has(s.countName)
    );

    this.chartData = {
      labels: this.labels,
      datasets: filtered.map((series, i) => ({
        label: series.countName,
        data: series.data,
        borderColor: this.colors[i % this.colors.length],
        backgroundColor: this.colors[i % this.colors.length] + '33',
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        spanGaps: false,
      })),
    };
  }
}
