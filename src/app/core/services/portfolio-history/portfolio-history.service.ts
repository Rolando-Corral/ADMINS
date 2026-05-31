import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { PortfolioSnapshot } from '../../interfaces/portfolio-snapshot.model';
import { ElectronService } from '../electron/electron.service';

@Injectable({ providedIn: 'root' })
export class PortfolioHistoryService {
  private readonly collection = 'snapshots';

  constructor(private electronService: ElectronService) {}

  getAll(): Observable<PortfolioSnapshot[]> {
    return from(this.electronService.getAll<PortfolioSnapshot>(this.collection));
  }

  getById(id: string): Observable<PortfolioSnapshot | null> {
    return from(this.electronService.getById<PortfolioSnapshot>(this.collection, id));
  }

  create(snapshot: PortfolioSnapshot): Observable<PortfolioSnapshot> {
    return from(this.electronService.create(this.collection, snapshot));
  }

  delete(id: string): Observable<boolean> {
    return from(this.electronService.delete(this.collection, id));
  }
}
