import { Component } from '@angular/core';

import { Producto } from '../../core/models/producto';
import { StorageService } from '../../core/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent {
  producto: Producto = {
    nombre: '',
    cantidad: 1,
    tipoTamanio: 'A4',
    precioMaterial: 0,
    tiempoMin: 0,
    costoHora: 0,
    tipoCorte: 'Manual',
    otrosCostos: 0,
    margen: 0,
    resultado: { costoUnitario: 0, costoTotal: 0 },
  };

  constructor(private storage: StorageService) {}

  calcular() {
    const tamaño = this.obtenerTamañoCM2();
    const costoMaterial = tamaño * this.producto.precioMaterial;
    const manoObra = (this.producto.tiempoMin / 60) * this.producto.costoHora;
    const costoCorte = this.getCostoCorte(this.producto.tipoCorte);
    const subtotal =
      costoMaterial + manoObra + costoCorte + this.producto.otrosCostos;
    const costoUnit = subtotal / this.producto.cantidad;
    const costoConMargen = costoUnit * (1 + this.producto.margen / 100);
    const total = costoConMargen * this.producto.cantidad;

    this.producto.resultado = {
      costoUnitario: parseFloat(costoConMargen.toFixed(2)),
      costoTotal: parseFloat(total.toFixed(2)),
    };

    this.storage.guardarProducto(this.producto);
    this.producto = structuredClone(this.producto); // reset para otro cálculo si quieres
  }

  obtenerTamañoCM2(): number {
    if (this.producto.tipoTamanio === 'Personalizado') {
      return (this.producto.ancho || 0) * (this.producto.alto || 0);
    }

    const tamaños = {
      A3: 29.7 * 42,
      A4: 21 * 29.7,
      Carta: 21.6 * 27.9,
    };

    return tamaños[this.producto.tipoTamanio];
  }

  getCostoCorte(tipo: string): number {
    switch (tipo) {
      case 'Cricut':
        return 0.5;
      case 'Cameo':
        return 0.6;
      case 'Manual':
        return 0.2;
      default:
        return 0;
    }
  }
}
