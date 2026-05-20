import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetModelTs } from '../../interfaces/asset.model';

@Injectable({ providedIn: 'root' })
export class AssetsService {

  private assetsAPIurl: string = 'http://localhost:3004/cuentas';

  private assets: AssetModelTs[] = [];

  constructor(private http: HttpClient) { }

  // read: obtener todas las cuentas desde la API y guardarlas localmente
  getAssetFromApi(): Observable<AssetModelTs[]> {
    return this.http.get<AssetModelTs[]>(this.assetsAPIurl);
  }

  // obtener assets guardados localmente
  getLocalAssets(): AssetModelTs[] {
    return this.assets;
  }

  // Armar un CRUD

  // create: agregar una cuenta
  addAsset(asset: AssetModelTs): Observable<AssetModelTs> {
    return this.http.post<AssetModelTs>(this.assetsAPIurl, asset);
  }
  
  // read: obtener una sola cuenta
  getAssetById(id: string): Observable<AssetModelTs> {
    return this.http.get<AssetModelTs>(`${this.assetsAPIurl}/${id}`);
  }

  // update: actualizar una cuenta
  updateAsset(id: string, asset: AssetModelTs): Observable<AssetModelTs> {
    return this.http.put<AssetModelTs>(`${this.assetsAPIurl}/${id}`, asset);
  }

  // delete: borrar una cuenta
  deleteAsset(id: string): Observable<void> {
    return this.http.delete<void>(`${this.assetsAPIurl}/${id}`);
  }

}