export interface Material {
  nombre: string;
  costo: number;
  tipoMaterial: MaterialType | null;
  tamanoHoja?: string;
  anchoHoja?: number;
  largoHoja?: number;
  anchoUtilizado?: number;
  largoUtilizado?: number;
  largoMaterial?: number;
  cantidadMaterial?: number;
  cantidadMaterialUsadoDelPaquete?: number;
  tipoPeso?: WeightUnit | null;
  tipoPesoUsado?: WeightUnit | null;
  cantidadPeso?: number;
  cantidadPesoUsado?: number;
  multiplicarMaterial?: number;
  costoMaterialUsado?: number;
}

export interface MaterialType {
  label: string;
  value: 'cuadrado' | 'metro' | 'unidad' | 'paquete' | 'peso';
}

export interface PaperSize {
  label: string;
  value: string;
  ancho?: number;
  largo?: number;
}

export interface TimeUnit {
  label: string;
  value: 'minutos' | 'horas';
}

export interface WeightUnit {
  label: string;
  value: 'gramos' | 'kilo';
}
