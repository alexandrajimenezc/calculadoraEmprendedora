import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project, WorkshopConfig, Equipment, TapeteCorte, SoftwareSuscripcion } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  private readonly KEY = 'calc_emp_v3';

  private _config = new BehaviorSubject<WorkshopConfig>(this.loadConfig());
  private _projects = new BehaviorSubject<Project[]>(this.loadProjects());
  private _current = new BehaviorSubject<Project | null>(null);
  private _equipment = new BehaviorSubject<Equipment[]>(this.loadEquipment());
  private _tapetes = new BehaviorSubject<TapeteCorte[]>(this.loadTapetes());
  private _software = new BehaviorSubject<SoftwareSuscripcion[]>(this.loadSoftware());

  workshopConfig$ = this._config.asObservable();
  projectList$ = this._projects.asObservable();
  currentProject$ = this._current.asObservable();
  equipmentList$ = this._equipment.asObservable();
  tapeteList$ = this._tapetes.asObservable();
  softwareList$ = this._software.asObservable();

  private ls(key: string) { return `${this.KEY}_${key}`; }
  private get(key: string) { return typeof window !== 'undefined' ? localStorage.getItem(this.ls(key)) : null; }
  private set(key: string, val: unknown) { if (typeof window !== 'undefined') localStorage.setItem(this.ls(key), JSON.stringify(val)); }

  // --- Config ---
  private loadConfig(): WorkshopConfig {
    const d = this.get('config');
    return d ? JSON.parse(d) : { 
      horasSemanales: 40, 
      salarioDeseado: 1200, 
      tarifHoraCalculada: 7.5, 
      gastosFijosMensuales: 0, 
      margenBeneficio: 30,
      currency: 'EUR',
      language: 'es'
    };
  }


  saveWorkshopConfig(c: WorkshopConfig): void {
    c.tarifHoraCalculada = c.horasSemanales > 0
      ? parseFloat((c.salarioDeseado / (c.horasSemanales * 4)).toFixed(2))
      : 0;
    this._config.next({ ...c });
    this.set('config', c);
  }

  // --- Equipment ---
  private loadEquipment(): Equipment[] { 
    const d = this.get('equipment'); 
    if (d) return JSON.parse(d);
    
    // Defaults requested by user
    return [
      { nombre: 'Cricut Explore 3', precio: 320, anosVidaUtil: 3, usoHorasMes: 20 },
      { nombre: 'Plastificadora Amazon', precio: 35, anosVidaUtil: 2, usoHorasMes: 5 },
      { nombre: 'Epson 2850', precio: 240, anosVidaUtil: 3, usoHorasMes: 15 },
      { nombre: 'Plancha Térmica Pro (60x40)', precio: 280, anosVidaUtil: 5, usoHorasMes: 30 },
      { nombre: 'Plancha de Tazas/Gorra', precio: 120, anosVidaUtil: 2, usoHorasMes: 10 },
      { nombre: 'Máquina de Coser Singer', precio: 220, anosVidaUtil: 5, usoHorasMes: 15 },
      { nombre: 'Impresora Sublimación', precio: 380, anosVidaUtil: 3, usoHorasMes: 20 }
    ];

  }

  saveEquipment(e: Equipment[]): void { this._equipment.next(e); this.set('equipment', e); }

  // --- Tapetes ---
  private loadTapetes(): TapeteCorte[] { const d = this.get('tapetes'); return d ? JSON.parse(d) : []; }
  saveTapetes(t: TapeteCorte[]): void { this._tapetes.next(t); this.set('tapetes', t); }

  // --- Software ---
  private loadSoftware(): SoftwareSuscripcion[] { const d = this.get('software'); return d ? JSON.parse(d) : []; }
  saveSoftware(s: SoftwareSuscripcion[]): void {
    s.forEach(sw => {
      sw.costoMensualCalculado = sw.ciclo === 'anual' ? parseFloat((sw.precio / 12).toFixed(2)) : sw.precio;
    });
    this._software.next([...s]);
    this.set('software', s);
  }

  // --- Projects ---
  private loadProjects(): Project[] { const d = this.get('projects'); return d ? JSON.parse(d) : []; }

  saveProject(p: Project): void {
    const list = this._projects.value;
    const idx = list.findIndex(x => x.id === p.id);
    idx >= 0 ? (list[idx] = p) : list.unshift(p);
    this._projects.next([...list]);
    this.set('projects', list);
  }

  deleteProject(id: string): void {
    const list = this._projects.value.filter(p => p.id !== id);
    this._projects.next(list);
    this.set('projects', list);
  }

  setCurrentProject(p: Project | null): void { this._current.next(p); }

  createNewProject(): Project {
    const config = { ...this._config.value };
    return {
      id: crypto.randomUUID(),
      nombre: 'Nuevo Proyecto',
      fecha: new Date().toISOString(),
      unidadesProduced: 1,
      materiales: [],
      insumos: [],
      manoDeObra: [],
      tapetes: [],
      costoTapetes: 0,
      depreciacionEquipos: 0,
      costoFijoProrrateado: 0,
      totalCosto: 0,
      precioSugerido: 0,
      projectConfig: config
    };
  }


  /**
   * Importa un backup JSON completo (proyectos, config, equipos, software)
   * Se llama desde el componente al leer el archivo.
   */
  importFromBackup(data: {
    version?: number;
    config?: WorkshopConfig;
    projects?: Project[];
    equipment?: Equipment[];
    software?: SoftwareSuscripcion[];
  }): void {
    if (data.config) this.saveWorkshopConfig(data.config);
    if (data.equipment) this.saveEquipment(data.equipment);
    if (data.software) this.saveSoftware(data.software);
    if (data.projects) {
      // Merge: no duplicar por id
      const existing = this._projects.value;
      data.projects.forEach(p => {
        const idx = existing.findIndex(e => e.id === p.id);
        idx >= 0 ? (existing[idx] = p) : existing.unshift(p);
      });
      this._projects.next([...existing]);
      this.set('projects', existing);
    }
  }
}
