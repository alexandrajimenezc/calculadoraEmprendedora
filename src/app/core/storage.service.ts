import { Injectable } from '@angular/core';
import { Producto } from './models/producto';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private key = 'productos';

  getProductos(): Producto[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  guardarProducto(producto: Producto): void {
    const productos = this.getProductos();
    productos.push(producto);
    localStorage.setItem(this.key, JSON.stringify(productos));
  }

  eliminarProducto(index: number): void {
    const productos = this.getProductos();
    productos.splice(index, 1);
    localStorage.setItem(this.key, JSON.stringify(productos));
  }
}
