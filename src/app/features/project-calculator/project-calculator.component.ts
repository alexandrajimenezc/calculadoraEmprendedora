import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectStateService } from '../../core/services/project-state.service';
import { CalculationService } from '../../core/services/calculation.service';
import { ExportService } from '../../core/services/export.service';
import { I18nService } from '../../core/services/i18n.service';
import { PdfService } from '../../core/services/pdf.service';

import {
  Project, WorkshopConfig, Material, Insumo, LaborTask,
  Equipment, TapeteCorte, TapeteUsoProyecto, SoftwareSuscripcion
} from '../../core/models/material';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-project-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './project-calculator.component.html',
  styleUrls: ['./project-calculator.component.scss'],
})
export class ProjectCalculatorComponent implements OnInit, OnDestroy {
  public config!: WorkshopConfig;
  public projects: Project[] = [];
  public currentProject: Project | null = null;
  public equipments: Equipment[] = [];
  public tapetes: TapeteCorte[] = [];
  public softwares: SoftwareSuscripcion[] = [];
  public viewMode: 'dashboard' | 'workshop' = 'dashboard';
  public selectedTabIndex = 0;
  public isRailOpen = false;

  public tapetePresets = [
    { nombre: 'Cricut Maker/Explore (Standard) 12x12"', marca: 'Cricut', modelo: 'Standard', tamanio: '30.5x30.5 cm', precioRef: 15 },
    { nombre: 'Cricut Maker/Explore (Standard) 12x24"', marca: 'Cricut', modelo: 'Standard XL', tamanio: '30.5x61 cm', precioRef: 28 },
    { nombre: 'Cricut Joy (Standard) 4.5x6.5"', marca: 'Cricut', modelo: 'Joy', tamanio: '11.4x16.5 cm', precioRef: 10 },
    { nombre: 'Cricut Joy (Standard) 4.5x12"', marca: 'Cricut', modelo: 'Joy L', tamanio: '11.4x30.4 cm', precioRef: 14 },
    { nombre: 'Cricut Joy Xtra (Standard) 8.5x12"', marca: 'Cricut', modelo: 'Joy Xtra', tamanio: '21.5x30.4 cm', precioRef: 16 },
    { nombre: 'Silhouette Cameo 12x12"', marca: 'Silhouette', modelo: 'Standard', tamanio: '30.5x30.5 cm', precioRef: 12 },
    { nombre: 'Silhouette Cameo 12x24"', marca: 'Silhouette', modelo: 'Standard XL', tamanio: '30.5x61 cm', precioRef: 22 },
    { nombre: 'Brother ScanNCut 12x12"', marca: 'Brother', modelo: 'Standard', tamanio: '30.5x30.5 cm', precioRef: 13 },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private state: ProjectStateService,
    public calc: CalculationService,
    private exporter: ExportService,
    private pdf: PdfService,
    private snackBar: MatSnackBar,
    public i18n: I18nService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.state.workshopConfig$.pipe(takeUntil(this.destroy$)).subscribe(c => {
      this.config = c;
      if (c.language) this.i18n.setLanguage(c.language);
    });
    this.state.projectList$.pipe(takeUntil(this.destroy$)).subscribe(p => this.projects = p);
    this.state.currentProject$.pipe(takeUntil(this.destroy$)).subscribe(p => {
      this.currentProject = p;
      if (p) this.recalculate();
    });
    this.state.equipmentList$.pipe(takeUntil(this.destroy$)).subscribe(e => this.equipments = e);
    this.state.tapeteList$.pipe(takeUntil(this.destroy$)).subscribe(t => this.tapetes = t);
    this.state.softwareList$.pipe(takeUntil(this.destroy$)).subscribe(s => this.softwares = s);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public startNewProject() {
    this.viewMode = 'dashboard';
    this.selectedTabIndex = 0;
    this.isRailOpen = false;
    const project = this.state.createNewProject();
    this.state.setCurrentProject(project);
  }

  public loadProject(project: Project) {
    this.viewMode = 'dashboard';
    this.selectedTabIndex = 0;
    this.isRailOpen = false;
    this.state.setCurrentProject(structuredClone(project));
  }

  public deleteProject(p: Project) {
    if (confirm(this.i18n.t('Confirm_Delete', { name: p.nombre }))) {
      this.state.deleteProject(p.id);
      if (this.currentProject?.id === p.id) {
        this.state.setCurrentProject(null);
      }
    }
  }

  public t(key: string): string { return this.i18n.t(key); }
  public cur(): string { return this.i18n.getCurrencySymbol(this.config?.currency || 'EUR'); }
  public curLabel(): string { return this.config?.currency || 'EUR'; }
  public getAvailableCurrencies(): string[] { return this.i18n.getAvailableCurrencies(); }

  public exportBackup() {
    const backup = {
      config: this.config,
      projects: this.projects,
      equipment: this.equipments,
      software: this.softwares
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_calculadora_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('📦 Backup generado', 'OK', { duration: 3000 });
  }

  public onImportBackup(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        this.state.importFromBackup(data);
        this.snackBar.open('✅ Datos importados', 'OK', { duration: 3000 });
      } catch (err) {
        this.snackBar.open('❌ Error al importar', 'Cerrar', { duration: 3000 });
      }
    };
    reader.readAsText(file);
  }

  public loadDemo() {
    const defaultCfg = { ...this.config };
    const demos: Project[] = [
      {
        id: 'demo-logo',
        nombre: 'Diseño de Logo / Branding',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [],
        insumos: [],
        manoDeObra: [
          { descripcion: 'Briefing y Concepto', tiempoMinutos: 45 },
          { descripcion: 'Diseño Vectorial', tiempoMinutos: 150 },
          { descripcion: 'Paleta de colores y Tipografía', tiempoMinutos: 60 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg, margenBeneficio: 150 }
      },
      {
        id: 'demo-candy-bar',
        nombre: 'Número 3D "7" (Papelería Creativa)',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Cartulina Grande Base', costo: 1, tipoMaterial: 'hojaCompleta', hojasTotalesCompradas: 1, hojasUsadasEnProyecto: 1, porcentajeMerma: 0 },
          { nombre: 'Cartulina Color Complementario', costo: 1, tipoMaterial: 'hojaCompleta', hojasTotalesCompradas: 1, hojasUsadasEnProyecto: 1, porcentajeMerma: 0 },
          { nombre: 'Acetato Transparente', costo: 1.5, tipoMaterial: 'hojaCompleta', hojasTotalesCompradas: 1, hojasUsadasEnProyecto: 2, porcentajeMerma: 0 },
          { nombre: 'Pack Cartulina Purpurina (10h)', costo: 3.55, tipoMaterial: 'hojaCompleta', hojasTotalesCompradas: 10, hojasUsadasEnProyecto: 4, porcentajeMerma: 5 },
          { nombre: 'Resma Opalina (100h)', costo: 7, tipoMaterial: 'paquete', cantidadTotalEnPaquete: 100, cantidadUtilizada: 3, porcentajeMerma: 0 }
        ],
        insumos: [
          { nombre: 'Pega Nuvo (Bote)', precio: 8.5, rendimiento: 20 },
          { nombre: 'Silicona (0.5 barra)', precio: 0.5, rendimiento: 1 },
          { nombre: 'Lentejuelas (3 botes)', precio: 3, rendimiento: 4 },
          { nombre: 'Pompones (Bolsita)', precio: 2, rendimiento: 1 },
          { nombre: 'Luces LED + Pilas', precio: 5, rendimiento: 1 }
        ],
        manoDeObra: [
          { descripcion: 'Diseño en Design Space', tiempoMinutos: 40 },
          { descripcion: 'Corte (14 tapetes)', tiempoMinutos: 25 },
          { descripcion: 'Armado de Estructura y Decoración', tiempoMinutos: 60 }
        ],
        tapetes: [{ tapeteNombre: 'Cricut Maker/Explore (Standard) 12x12"', tamanio: '30.5x30.5 cm', precioPorPasada: 0.35, pasadasEnProyecto: 14 }],
        costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-globo-burbuja',
        nombre: 'Globo Burbuja Personalizado',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Globo Burbuja 24"', costo: 3.5, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 10 },
          { nombre: 'Vinilo Adhesivo', costo: 10, tipoMaterial: 'metro', largoMaterial: 1, largoUtilizadoMetro: 0.3, porcentajeMerma: 15 }
        ],
        insumos: [
          { nombre: 'Pintura Acrílica interna', precio: 4, rendimiento: 10 },
          { nombre: 'Cinta y Confeti', precio: 2, rendimiento: 1 },
          { nombre: 'Helio', precio: 65, rendimiento: 12 }
        ],
        manoDeObra: [
          { descripcion: 'Preparación y Pintado', tiempoMinutos: 15 },
          { descripcion: 'Corte y Pelado de Vinilo', tiempoMinutos: 20 },
          { descripcion: 'Inflado y Acabado', tiempoMinutos: 15 }
        ],
        tapetes: [{ tapeteNombre: 'Cricut Maker/Explore (Standard) 12x12"', tamanio: '30.5x30.5 cm', precioPorPasada: 0.35, pasadasEnProyecto: 2 }],
        costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-sub-camiseta',
        nombre: 'Sublimación Camiseta Deportiva',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Camiseta Poliéster Blanca', costo: 3.8, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 5 },
          { nombre: 'Papel Sublimación A4', costo: 15, tipoMaterial: 'hojaCompleta', hojasTotalesCompradas: 100, hojasUsadasEnProyecto: 1, porcentajeMerma: 2 }
        ],
        insumos: [
          { nombre: 'Tinta Sublimación pack', precio: 50, rendimiento: 80 },
          { nombre: 'Cinta térmica', precio: 4, rendimiento: 20 }
        ],
        manoDeObra: [
          { descripcion: 'Limpieza y Pre-planchado', tiempoMinutos: 5 },
          { descripcion: 'Sublimación (Plancha Térmica)', tiempoMinutos: 10 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-taza',
        nombre: 'Sublimación de Taza Cerámica',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Taza Blanca 11oz', costo: 1.5, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 10 }
        ],
        insumos: [
          { nombre: 'Caja para Taza', precio: 0.6, rendimiento: 1 }
        ],
        manoDeObra: [
          { descripcion: 'Diseño e Impresión', tiempoMinutos: 10 },
          { descripcion: 'Planchado de taza', tiempoMinutos: 8 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-agenda',
        nombre: 'Agenda Personalizada (Anillada)',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Hojas interiores (Pack 100)', costo: 6, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 0 },
          { nombre: 'Cartón Gris 2mm', costo: 1.5, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 5 }
        ],
        insumos: [
          { nombre: 'Anillado metálico', precio: 0.9, rendimiento: 1 },
          { nombre: 'Laminado en frío', precio: 0.5, rendimiento: 1 }
        ],
        manoDeObra: [
          { descripcion: 'Diseño Planify Pro', tiempoMinutos: 30 },
          { descripcion: 'Perforado y Anillado', tiempoMinutos: 20 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-arco-globos',
        nombre: 'Decoración Arco Orgánico Globos',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Bolsa globos R12 (Pack 50)', costo: 12, tipoMaterial: 'paquete', cantidadTotalEnPaquete: 50, cantidadUtilizada: 40, porcentajeMerma: 10 },
          { nombre: 'Globos R5 (Pack 50)', costo: 8, tipoMaterial: 'paquete', cantidadTotalEnPaquete: 50, cantidadUtilizada: 30, porcentajeMerma: 10 }
        ],
        insumos: [
          { nombre: 'Cinta estructura / Puntos pegante', precio: 4, rendimiento: 2 },
          { nombre: 'Nylon / Alambre', precio: 2, rendimiento: 5 }
        ],
        manoDeObra: [
          { descripcion: 'Inflado de globos', tiempoMinutos: 60 },
          { descripcion: 'Montaje en sitio', tiempoMinutos: 90 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-piñata',
        nombre: 'Piñata Temática Artesanal',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Cartón Corrugado', costo: 3, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 0 },
          { nombre: 'Papel Crepé (Varios)', costo: 5, tipoMaterial: 'unidad', cantidadComprada: 5, cantidadUsadaUnidad: 3, porcentajeMerma: 10 }
        ],
        insumos: [
          { nombre: 'Silicón / Mezcla pegante', precio: 3, rendimiento: 2 }
        ],
        manoDeObra: [
          { descripcion: 'Estructura cartón', tiempoMinutos: 45 },
          { descripcion: 'Decoración papel', tiempoMinutos: 90 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-cartuchera',
        nombre: 'Confección Cartuchera Personalizada',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Tela Lona / Canvas', costo: 12, tipoMaterial: 'metro', largoMaterial: 1, largoUtilizadoMetro: 0.4, porcentajeMerma: 5 },
          { nombre: 'Forro interno', costo: 6, tipoMaterial: 'metro', largoMaterial: 1, largoUtilizadoMetro: 0.4, porcentajeMerma: 5 }
        ],
        insumos: [
          { nombre: 'Cierre Cremallera', precio: 0.8, rendimiento: 1 },
          { nombre: 'Hilo poliéster', precio: 2, rendimiento: 10 }
        ],
        manoDeObra: [
          { descripcion: 'Corte de tela', tiempoMinutos: 15 },
          { descripcion: 'Costura (Máquina Singer)', tiempoMinutos: 40 }
        ],
        tapetes: [], costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      },
      {
        id: 'demo-vaso-vinilo',
        nombre: 'Vaso Starbucks con Vinilo',
        fecha: new Date().toISOString(),
        unidadesProduced: 1,
        materiales: [
          { nombre: 'Vaso Reutilizable', costo: 2.5, tipoMaterial: 'unidad', cantidadComprada: 1, cantidadUsadaUnidad: 1, porcentajeMerma: 0 },
          { nombre: 'Vinilo Permanente (Retazo)', costo: 15, tipoMaterial: 'metro', largoMaterial: 1, largoUtilizadoMetro: 0.1, porcentajeMerma: 10 }
        ],
        insumos: [
          { nombre: 'Papel Transfer', precio: 8, rendimiento: 20 }
        ],
        manoDeObra: [
          { descripcion: 'Diseño Circular', tiempoMinutos: 10 },
          { descripcion: 'Pegado de Vinilo', tiempoMinutos: 15 }
        ],
        tapetes: [{ tapeteNombre: 'Cricut Maker/Explore (Standard) 12x12"', tamanio: '30.5x30.5 cm', precioPorPasada: 0.35, pasadasEnProyecto: 1 }],
        costoTapetes: 0, depreciacionEquipos: 0, costoFijoProrrateado: 0, totalCosto: 0, precioSugerido: 0,
        projectConfig: { ...defaultCfg }
      }
    ];

    demos.forEach(p => {
      this.currentProject = p;
      this.recalculate();
      this.state.saveProject(p);
    });

    this.state.setCurrentProject(demos[0]);

    if (this.softwares.length === 0) {
      this.softwares = [
        { id: crypto.randomUUID(), nombre: 'Cricut Access', precio: 9, ciclo: 'mensual' },
        { id: crypto.randomUUID(), nombre: 'Canva Pro', precio: 12, ciclo: 'mensual' },
        { id: crypto.randomUUID(), nombre: 'Planify Pro', precio: 9, ciclo: 'mensual' },
        { id: crypto.randomUUID(), nombre: 'Creative Fabrica', precio: 19, ciclo: 'mensual' }
      ];
      this.state.saveSoftware(this.softwares);
    }

    if (this.equipments.length === 0) {
       // Si no hay equipos, ProjectStateService ya carga defaults, pero aseguramos uso
       this.state.equipmentList$.pipe(takeUntil(this.destroy$)).subscribe(e => this.equipments = e);
    }

    this.recalculate();
    this.viewMode = 'dashboard';
    this.snackBar.open('🎉 Catálogo de 10 ejemplos cargado correctamente.', 'OK', { duration: 4000 });
  }


  public openGlobalWorkshop() {
    this.state.setCurrentProject(null);
    this.viewMode = 'workshop';
    this.selectedTabIndex = 0;
  }

  public addMaterial() {
    if (!this.currentProject) return;
    this.currentProject.materiales.push({ nombre: '', costo: 0, tipoMaterial: 'hojaCompleta', porcentajeMerma: 0, costoCalculado: 0 });
  }

  public removeMaterial(i: number) { this.currentProject?.materiales.splice(i, 1); this.recalculate(); }

  public addInsumo() {
    if (!this.currentProject) return;
    this.currentProject.insumos.push({ nombre: '', precio: 0, rendimiento: 1 });
  }

  public removeInsumo(i: number) { this.currentProject?.insumos.splice(i, 1); this.recalculate(); }

  public addLabor() {
    if (!this.currentProject) return;
    this.currentProject.manoDeObra.push({ descripcion: '', tiempoMinutos: 0 });
  }

  public removeLabor(k: number) { this.currentProject?.manoDeObra.splice(k, 1); this.recalculate(); }

  public addTapeteUso() {
    if (!this.currentProject) return;
    this.currentProject.tapetes.push({ tapeteNombre: '', tamanio: '', precioPorPasada: 0, pasadasEnProyecto: 1, costoCalculado: 0 });
  }

  public removeTapeteUso(i: number) { this.currentProject?.tapetes.splice(i, 1); this.recalculate(); }

  public onTapetePresetSelected(tapeteUso: TapeteUsoProyecto, presetNombre: string) {
    const preset = this.tapetePresets.find(p => p.nombre === presetNombre);
    if (preset) {
      tapeteUso.tapeteNombre = preset.nombre;
      tapeteUso.tamanio = preset.tamanio;
      tapeteUso.precioPorPasada = parseFloat((preset.precioRef / 40).toFixed(4));
    }
    this.recalculate();
  }

  public addEquipment() { this.equipments.push({ nombre: '', precio: 0, anosVidaUtil: 3, usoHorasMes: 20 }); this.saveEquipment(); }
  public removeEquipment(i: number) { this.equipments.splice(i, 1); this.saveEquipment(); }
  public saveEquipment() { this.state.saveEquipment([...this.equipments]); this.recalculate(); }

  public addSoftware() { this.softwares.push({ id: crypto.randomUUID(), nombre: '', precio: 0, ciclo: 'mensual' }); this.saveSoftware(); }
  public removeSoftware(i: number) { this.softwares.splice(i, 1); this.saveSoftware(); }
  public saveSoftware() { this.state.saveSoftware([...this.softwares]); this.recalculate(); }

  public recalculate() {
    if (!this.currentProject) return;
    if (this.currentProject.projectConfig) {
       const cp = this.currentProject.projectConfig;
       cp.tarifHoraCalculada = cp.horasSemanales > 0 ? parseFloat((cp.salarioDeseado / (cp.horasSemanales * 4)).toFixed(2)) : 0;
    }
    const cfg = this.currentProject.projectConfig || this.config;
    this.currentProject.materiales.forEach(m => m.costoCalculado = this.calc.calculateMaterialCost(m));
    const subtotalMaterials = this.getSubtotalMaterials();
    const subtotalInsumos = this.getSubtotalInsumos();
    this.currentProject.tapetes.forEach(t => t.costoCalculado = this.calc.calculateTapeteCost(t));
    this.currentProject.costoTapetes = this.currentProject.tapetes.reduce((sum, t) => sum + (t.costoCalculado || 0), 0);
    const laborCost = this.calc.calculateLaborCost(this.currentProject.manoDeObra, cfg.tarifHoraCalculada);
    const totalMinutes = this.getTotalMinutes();
    const hourlyDepreciation = this.equipments.reduce((sum, e) => sum + this.calc.calculateEquipmentDepreciation(e), 0);
    this.currentProject.depreciacionEquipos = parseFloat(((totalMinutes / 60) * hourlyDepreciation).toFixed(2));
    const softwareMonthly = this.calc.calculateSoftwareMonthlyCost(this.softwares);
    this.currentProject.costoFijoProrrateado = this.calc.calculateOverhead((cfg as any).gastosFijosMensuales || 0, softwareMonthly, cfg.horasSemanales * 4, totalMinutes);
    this.currentProject.totalCosto = subtotalMaterials + subtotalInsumos + laborCost + this.currentProject.costoTapetes + this.currentProject.depreciacionEquipos + this.currentProject.costoFijoProrrateado;
    this.currentProject.precioSugerido = this.calc.calculateSuggestedPrice(this.currentProject.totalCosto, cfg.margenBeneficio);
  }

  public getSubtotalMaterials(): number { return this.currentProject?.materiales.reduce((sum, m) => sum + (m.costoCalculado || 0), 0) || 0; }
  public getSubtotalInsumos(): number { return this.currentProject?.insumos.reduce((sum, i) => sum + ((i.precio || 0) / (i.rendimiento || 1)), 0) || 0; }
  public getLaborCost(): number { return this.currentProject ? this.calc.calculateLaborCost(this.currentProject.manoDeObra, (this.currentProject.projectConfig || this.config).tarifHoraCalculada) : 0; }
  public getEquipDepreciation(eq: Equipment): number { return this.calc.calculateEquipmentDepreciation(eq); }
  public getSoftwareMonthlyTotal(): number { return this.calc.calculateSoftwareMonthlyCost(this.softwares); }
  public getMaterialIcon(tipo: string): string {
    const icons: Record<string, string> = { hojaCompleta: 'description', cuadrado: 'crop', unidad: 'tag', paquete: 'inventory', bote: 'water_drop', metro: 'straighten', peso: 'scale' };
    return icons[tipo] || 'category';
  }
  public getTotalMinutes(): number { return this.currentProject?.manoDeObra.reduce((sum, t) => sum + (t.tiempoMinutos || 0), 0) || 0; }

  public saveCurrentProject() {
    if (this.currentProject) {
      this.recalculate();
      this.state.saveProject(this.currentProject);
      this.snackBar.open(this.t('Msg_Saved'), 'OK', { duration: 3000 });
    }
  }

  public saveConfig() {
    this.state.saveWorkshopConfig(this.config);
    if (this.config.language) this.i18n.setLanguage(this.config.language);
    this.recalculate();
    this.snackBar.open(this.t('Msg_Config_Saved'), 'OK', { duration: 2000 });
  }

  public saveProjectConfig() {
    if (this.currentProject?.projectConfig) {
      const c = this.currentProject.projectConfig;
      c.tarifHoraCalculada = c.horasSemanales > 0 ? parseFloat((c.salarioDeseado / (c.horasSemanales * 4)).toFixed(2)) : 0;
      this.recalculate();
      this.state.saveProject(this.currentProject);
    }
  }

  public resetProjectConfigToGlobal() {
    if (this.currentProject) {
      this.currentProject.projectConfig = { ...this.config };
      this.recalculate();
      this.state.saveProject(this.currentProject);
      this.snackBar.open('🔄 Valores restablecidos.', 'OK', { duration: 2000 });
    }
  }

  public exportCSV() {
    if (this.currentProject) {
      this.recalculate();
      this.exporter.exportProjectToCSV(this.currentProject);
      this.snackBar.open('📥 CSV descargado', 'Cerrar', { duration: 3000 });
    }
  }

  public exportPDF() {
    if (this.currentProject) {
      this.recalculate();
      this.pdf.exportProjectToPdf(this.currentProject, this.currentProject.projectConfig || this.config, this.cur());
      this.snackBar.open('📄 PDF generado', 'Cerrar', { duration: 3000 });
    }
  }

  public openBreakdown(template: any) {
    this.dialog.open(template, {
      width: '450px',
      panelClass: 'custom-breakdown-dialog'
    });
  }

  public getProfitValue(): number {
     if (!this.currentProject) return 0;
     const cfg = this.currentProject.projectConfig || this.config;
     return parseFloat((this.currentProject.totalCosto * (cfg.margenBeneficio / 100)).toFixed(2));
  }
}
