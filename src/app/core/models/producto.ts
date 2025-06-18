export interface Producto {
  nombre: string;
  cantidad: number;
  ancho?: number;
  alto?: number;
  tipoTamanio: 'A3' | 'A4' | 'Carta' | 'Personalizado';
  precioMaterial: number;
  tiempoMin: number;
  costoHora: number;
  tipoCorte: 'Manual' | 'Cricut' | 'Cameo';
  otrosCostos: number;
  margen: number;
  resultado: {
    costoUnitario: number;
    costoTotal: number;
  };
}
