import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AssetModelTs } from '../../interfaces/asset.model';
import { ElectronService } from '../electron/electron.service';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly collection = 'cuentas';

  constructor(private electronService: ElectronService) {}

  getAssetFromApi(): Observable<AssetModelTs[]> {
    return from(this.electronService.getAll<AssetModelTs>(this.collection));
  }

  addAsset(asset: AssetModelTs): Observable<AssetModelTs> {
    return from(this.electronService.create(this.collection, asset));
  }

  getAssetById(id: string): Observable<AssetModelTs | null> {
    return from(this.electronService.getById<AssetModelTs>(this.collection, id));
  }

  updateAsset(id: string, asset: AssetModelTs): Observable<AssetModelTs | null> {
    return from(this.electronService.update(this.collection, id, asset));
  }

  deleteAsset(id: string): Observable<boolean> {
    return from(this.electronService.delete(this.collection, id));
  }
}
