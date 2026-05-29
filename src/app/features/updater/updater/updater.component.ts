import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetsService } from 'src/app/core/services/assets/assets.service.ts.service';
import { AssetModelTs } from 'src/app/core/interfaces/asset.model';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

@Component({
  selector: 'app-updater',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './updater.component.html',
  styleUrls: ['./updater.component.scss']
})
export class UpdaterComponent implements OnInit {

  assetForm: FormGroup;
  categories: string[] = ['cuenta remunerada', 'plazo fijo en USD', 'posición'];
  currencies: string[] = ['USD', 'ARS'];

  constructor(
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private notificationService: NotificationService,
  ) {
    this.assetForm = this.createForm();
  }

  ngOnInit(): void {
  }

  private createForm(): FormGroup {
    return this.fb.group({
      id: [this.generateUUID()],
      countName: ['', Validators.required],
      currency: ['USD', Validators.required],
      shares: [null],
      acquisitionCostUsd: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  onSubmit(): void {
    if (this.assetForm.valid) {
      const asset: AssetModelTs = this.assetForm.value;
      
      this.assetsService.addAsset(asset).subscribe({
        next: (response) => {
          console.log('Asset guardado:', response);
          this.notificationService.success('Asset guardado correctamente');
          this.resetForm();
        },
        error: (err) => {
          console.error('Error guardando asset:', err);
          this.notificationService.error('Ha ocurrido un error al guardar el asset');
        }
      });
    } else {
      this.assetForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.assetForm = this.createForm();
  }
}
