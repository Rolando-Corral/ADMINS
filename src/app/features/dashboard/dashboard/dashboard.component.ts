import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model';
import { AssetsService } from 'src/app/core/services/assets/assets.service.ts.service';
import { DollarServiceTsService } from 'src/app/core/services/dollar/dollar.service.ts.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  public valores: number[] = [];
  public fechaActualizacion: string = '';
  public remuneratedAccounts: AssetModelTs[] = [];
  public assetsUSD: AssetModelTs[] = [];
  public fixedTerm: AssetModelTs[] = [];
  public allPositions: AssetModelTs[] = [];
  public capitalTotal: number = 0;
  public isAPosition: boolean = false;
  public isUpdatingPrices: boolean = false;

  showEditModal = false;
  editForm: FormGroup;
  selectedAssetId = '';
  editModalTitle = '';
  editBalanceLabel = 'Saldo (ARS)';

  constructor(
    private dollarService: DollarServiceTsService,
    private assetsService: AssetsService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      countName: ['', Validators.required],
      currency: ['ARS', Validators.required],
      acquisitionCostUsd: [0, [Validators.required, Validators.min(0)]],
      category: ['cuenta remunerada', Validators.required],
    });
  }

  ngOnInit(): void {
    this.myAssets();
    this.showDollarRate();
    this.showOnlyDollars();
    this.showOnlyPositions();
  }

  showDollarRate() {
    this.dollarService.getDollarRate().subscribe(data => {
      this.valores = [data.compra, data.venta];
      this.fechaActualizacion = data.fechaActualizacion;
      this.capitalTotal = this.calcularCapitalTotal();
    });
  }

  getdollarRate(): Observable<{ compra: number; venta: number; fechaActualizacion: string; }> {
    return this.dollarService.getDollarRate();
  }

  myAssets(): void {
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.remuneratedAccounts = assets.filter(asset => asset.category === 'cuenta remunerada');
        this.assetsUSD = assets.filter(asset => asset.currency === 'USD');

        // Leer precios desde localStorage (cache de StockService)
        this.assetsUSD.forEach(asset => {
          const cached = localStorage.getItem(`stock_${asset.countName}`);
          if (cached) {
            try {
              const cachedData = JSON.parse(cached);
              asset.currentValueUsd = cachedData.price;
            } catch (e) {
              console.error('Error leyendo cache para', asset.countName, e);
            }
          }
        });
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    });
  }

  // filtrar solo dolares
  showOnlyDollars() {
    // this.fixedTerm = this.assetsUSD.filter(asset => asset.category === 'plazo fijo en USD');
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.fixedTerm = assets.filter(asset => asset.category === 'plazo fijo en USD');
        console.log('saldo en dolares: ', this.fixedTerm);
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    })
  }

  showOnlyPositions() {
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.allPositions = assets.filter(asset => asset.category === 'posición');
        console.log('posiciones: ', this.allPositions);
      },
      error: (err) => {
        console.error('Error obteniendo assets:', err);
      }
    })
  }

  calcularCapitalTotal(): number {
    const totalARS = this.remuneratedAccounts.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSD = this.assetsUSD.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    const totalUSDInARS = totalUSD * this.valores[0];

    return totalARS + totalUSDInARS;
  }

  calcularTotalInShares(): string|number {
    const preTotalUSD = this.assetsUSD.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    let totalUSD = preTotalUSD - this.fixedTerm.reduce((total, asset) => total + asset.acquisitionCostUsd, 0);
    return totalUSD.toFixed(2);
  }

  editRemuneratedAccount(id: string): void {
    this.openAssetEdit(
      id,
      this.remuneratedAccounts,
      'No se encontró la cuenta remunerada',
      'Editar cuenta remunerada',
      'Saldo (ARS)',
    );
  }

  editFixedTermAccount(id: string): void {
    this.openAssetEdit(
      id,
      this.fixedTerm,
      'No se encontró el plazo fijo',
      'Editar plazo fijo en USD',
      'Saldo (USD)',
    );
  }

  private openAssetEdit(
    id: string,
    accounts: AssetModelTs[],
    notFoundMessage: string,
    modalTitle: string,
    balanceLabel: string,
  ): void {
    const asset = accounts.find(account => account.id === id);

    if (!asset) {
      this.notificationService.error(notFoundMessage);
      return;
    }

    this.editModalTitle = modalTitle;
    this.editBalanceLabel = balanceLabel;
    this.selectedAssetId = id;
    this.editForm.patchValue({
      countName: asset.countName,
      currency: asset.currency,
      acquisitionCostUsd: asset.acquisitionCostUsd,
      category: asset.category,
    });
    this.showEditModal = true;
  }

  saveEditedAsset(): void {
    if (!this.editForm.valid || !this.selectedAssetId) {
      this.editForm.markAllAsTouched();
      return;
    }

    const updatedAsset: AssetModelTs = {
      id: this.selectedAssetId,
      ...this.editForm.value,
    };

    const successMessage = updatedAsset.category === 'plazo fijo en USD'
      ? 'Plazo fijo actualizado correctamente'
      : 'Cuenta remunerada actualizada correctamente';

    this.assetsService.updateAsset(this.selectedAssetId, updatedAsset).subscribe({
      next: () => {
        this.notificationService.success(successMessage);
        this.closeEditModal();
        this.myAssets();
        this.showOnlyDollars();
        this.showDollarRate();
      },
      error: () => {
        this.notificationService.error('Ha ocurrido un error al actualizar el activo');
      },
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedAssetId = '';
    this.editModalTitle = '';
    this.editForm.reset({
      currency: 'ARS',
      acquisitionCostUsd: 0,
      category: 'cuenta remunerada',
    });
  }

}