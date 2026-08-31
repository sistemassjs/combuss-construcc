// src/app/pages/cargas/cargas.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
//import { format } from 'date-fns';
import { CargasService } from '../../services/cargas.service';
import { NuevaCargaPage } from '../nueva-carga/nueva-carga.page';

@Component({
  selector: 'app-cargas',
  templateUrl: './cargas.page.html',
  standalone: false,
})
export class CargasPage implements OnInit {
  //selectedMonth = format(new Date(), 'yyyy-MM'); // YYYY-MM
  //selectedMonth: string = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  selectedMonth: string = this.formatMonth(new Date().toISOString());

  items: any[] = [];
  loading = false;
  page = 1;
  meta?: { total: number; per_page: number; page: number };
  showMonthPicker = false;

  constructor(private api: CargasService, private modalCtrl: ModalController) {}

  get hasMorePages(): boolean {
    if (!this.meta || this.meta.per_page <= 0) {
      return false;
    }
    const totalPages = Math.ceil(this.meta.total / this.meta.per_page);
    return this.page < totalPages;
  }

  ngOnInit() {
    this.load();
  }

  toggleMonthPicker() {
    this.showMonthPicker = !this.showMonthPicker;
  }

  load(reset = true) {
    if (reset) {
      this.page = 1;
      this.items = [];
    }
    this.loading = true;

    // ahora selectedMonth ya está en formato "YYYYMM"
    this.api.listByMonth(this.selectedMonth, this.page).subscribe({
      next: (res) => {
        this.items = reset ? res.data : this.items.concat(res.data);
        this.meta = res.meta;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  // convierte "YYYY-MM" o "YYYY-MM-DD..." a "YYYYMM"
  private formatMonth(value: string): string {
    return value.slice(0, 7).replace('-', ''); // "2025-08" -> "202508"
  }

  onMonthChange(ev: any) {
    const v: string = ev.detail.value; // "2025-08" o "2025-08-01T00:00:00Z"
    this.selectedMonth = this.formatMonth(v); // lo convertimos a "YYYYMM"
    this.showMonthPicker = false;
    this.load(true);
  }

  loadMoreClick() {
    if (!this.hasMorePages || this.loading) {
      return;
    }
    this.page++;
    this.load(false);
  }

  async abrirNueva() {
    const modal = await this.modalCtrl.create({
      component: NuevaCargaPage,
      breakpoints: [0, 0.9],
      initialBreakpoint: 0.9,
      componentProps: {
        serieFija: 'CA', // <- ajusta tu serie por defecto
      },
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'saved') this.load(true); // refrescar lista
  }
}
