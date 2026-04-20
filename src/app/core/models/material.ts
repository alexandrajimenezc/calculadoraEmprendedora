export interface Material {
  id?: string;
  nombre: string;
  costo: number;
  tipoMaterial: 'hojaCompleta' | 'cuadrado' | 'metro' | 'unidad' | 'paquete' | 'peso' | 'bote';

  // hojaCompleta (cartulinas escarchadas, retazos no reusables)
  hojasTotalesCompradas?: number;
  hojasUsadasEnProyecto?: number;

  // cuadrado (recortes parciales de una hoja)
  anchoHoja?: number;
  largoHoja?: number;
  anchoUtilizado?: number;
  largoUtilizado?: number;
  cantidadRecortes?: number;

  // metro
  largoMaterial?: number;
  largoUtilizadoMetro?: number;

  // paquete (pompones, lentejuelas)
  cantidadTotalEnPaquete?: number;
  cantidadUtilizada?: number;

  // bote/peso (pegamento Nuvo, pintura, resina)
  contenidoTotal?: number;
  contenidoUsado?: number;
  unidadContenido?: 'gramos' | 'ml' | 'kilo' | 'litro';

  // unidad (LEDs, pilas, botones)
  cantidadComprada?: number;
  cantidadUsadaUnidad?: number;

  porcentajeMerma: number;
  costoCalculado?: number;
}

export interface PaperSize {
  label: string;
  value: string;
  ancho: number;
  largo: number;
}

export interface TapeteCorte {
  nombre: string;
  marca: string;
  modelo: string;
  tamanio: string; // ← sin ñ para evitar errores de parser
  precio: number;
  vidaUtilPasadas: number;
  pasadasUsadas: number;
  depreciacionPorPasada?: number;
}

export interface SoftwareSuscripcion {
  id: string;
  nombre: string; // Cricut Design Space, Illustrator, Procreate...
  precio: number;
  ciclo: 'mensual' | 'anual';
  costoMensualCalculado?: number;
}

export interface WorkshopConfig {
  horasSemanales: number;
  salarioDeseado: number;
  tarifHoraCalculada: number;
  gastosFijosMensuales: number;
  margenBeneficio: number;
  currency: 'EUR' | 'USD' | 'BRL' | 'CLP' | 'COP' | 'ARS' | 'VES' | 'PEN';
  language: 'es' | 'pt';
}


export interface Project {
  id: string;
  nombre: string;
  fecha: string;
  unidadesProduced: number;
  materiales: Material[];
  insumos: Insumo[];
  manoDeObra: LaborTask[];
  tapetes: TapeteUsoProyecto[];
  costoTapetes: number;
  depreciacionEquipos: number;
  costoFijoProrrateado: number;
  totalCosto: number;
  precioSugerido: number;
  projectConfig?: WorkshopConfig;
}


export interface TapeteUsoProyecto {
  tapeteNombre: string;
  tamanio: string;
  precioPorPasada: number;
  pasadasEnProyecto: number;
  costoCalculado?: number;
}


export interface Insumo {
  nombre: string;
  precio: number;
  rendimiento: number;
}

export interface LaborTask {
  descripcion: string;
  tiempoMinutos: number;
}

export interface Equipment {
  nombre: string;
  marca?: string;
  modelo?: string;
  precio: number;
  anosVidaUtil: number;
  usoHorasMes: number;
  depreciacionCalculada?: number;
}
