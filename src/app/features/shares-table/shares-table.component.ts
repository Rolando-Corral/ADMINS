import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsService } from 'src/app/core/services/assets/assets.service.ts.service';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-shares-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shares-table.component.html',
  styleUrls: ['./shares-table.component.scss']
})
export class SharesTableComponent implements OnInit {

  positions: AssetModelTs[] = [];
  isLoading: boolean = false;
  
  // Modal properties
  showModal: boolean = false;
  editForm: FormGroup;
  selectedAssetId: string = '';


  constructor(
    private assetsService: AssetsService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      countName: ['', Validators.required],
      currency: ['USD', Validators.required],
      shares: [null, [Validators.required, Validators.min(0)]],
      acquisitionCostUsd: [0, [Validators.required, Validators.min(0)]],
      currentValueUsd: [null], // Opcional - precio actual por acción
      category: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.isLoading = true;
    this.assetsService.getAssetFromApi().subscribe({
      next: (assets) => {
        this.positions = assets.filter(a => a.category === 'posición');
        this.loadCachedPrices();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando posiciones:', err);
        this.notificationService.error('Ha ocurrido un error al cargar las posiciones');
        this.isLoading = false;
      }
    });
  }

  private loadCachedPrices(): void {
    this.positions.forEach(position => {
      const cached = localStorage.getItem(`stock_${position.countName}`);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          position.currentValueUsd = cachedData.price;
        } catch (e) {
          console.error('Error leyendo cache para', position.countName, e);
        }
      }
    });
  }

  editAsset(id: string): void {
    const asset = this.positions.find(p => p.id === id);
    if (asset) {
      this.selectedAssetId = id;
      this.editForm.patchValue({
        countName: asset.countName,
        currency: asset.currency,
        shares: asset.shares || null,
        acquisitionCostUsd: asset.acquisitionCostUsd,
        currentValueUsd: asset.currentValueUsd || null, // Opcional
        category: asset.category
      });
      this.showModal = true;
    }
  }

  saveEdit(): void {
    if (this.editForm.valid && this.selectedAssetId) {
      const updatedAsset: AssetModelTs = this.editForm.value;
      
      // Si se ingresó un valor actual, guardarlo en localStorage
      const currentValue = this.editForm.get('currentValueUsd')?.value;
      if (currentValue && updatedAsset.countName) {
        const cached = {
          price: currentValue,
          timestamp: Date.now()
        };
        localStorage.setItem(`stock_${updatedAsset.countName}`, JSON.stringify(cached));
      }
      
      this.assetsService.updateAsset(this.selectedAssetId, updatedAsset).subscribe({
        next: (response) => {
          console.log('Asset actualizado:', response);
          // alert('Asset actualizado correctamente');
          this.notificationService.success('Asset actualizado correctamente');
          this.closeModal();
          this.loadPositions();
        },
        error: (err) => {
          console.error('Error actualizando asset:', err);
          // alert('Error actualizando asset');
          this.notificationService.error('Ha ocurrido un error al actualizar el asset');
        }
      });
    } else {
      this.editForm.markAllAsTouched();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAssetId = '';
    this.editForm.reset({
      currency: 'USD',
      shares: null,
      acquisitionCostUsd: 0,
      category: ''
    });
  }

  async deleteAsset(id: string): Promise<void> {
    
    if (await this.notificationService.confirm('¿Estás seguro de que deseas eliminar este asset?')) {
      this.assetsService.deleteAsset(id).subscribe({
        next: () => {
          console.log('Asset eliminado:', id);
          this.notificationService.success('Asset eliminado correctamente');
          this.loadPositions();
        },
        error: (err) => {
          console.error('Error eliminando asset:', err);
          this.notificationService.error('Ha ocurrido un error al eliminar el asset');
        }
      });
    }
  }

  calculatePurchaseTotal(asset: AssetModelTs): number {
    return (asset.acquisitionCostUsd || 0); // Ya es el total que pagaste
  }

  calculateCurrentTotal(asset: AssetModelTs): number {
    return (asset.currentValueUsd || 0) * (asset.shares || 1); // Precio por acción × tus acciones
  }

  calculateTotalDifference(): number {
    return this.positions.reduce((total, asset) => {
      const difference = this.calculateCurrentTotal(asset) - this.calculatePurchaseTotal(asset);
      return total + difference;
    }, 0);
  }
}