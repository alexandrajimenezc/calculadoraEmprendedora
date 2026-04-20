import { Injectable } from '@angular/core';
import { Project } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporta un proyecto a CSV compatible con Excel.
   */
  exportProjectToCSV(project: Project): void {
    const rows: string[][] = [
      ['PRESUPUESTO', project.nombre, ''],
      ['Fecha', new Date(project.fecha).toLocaleDateString('es-ES'), ''],
      ['Unidades a producir', project.unidadesProduced.toString(), ''],
      ['', '', ''],
      ['--- MATERIALES ---', '', ''],
      ['Nombre', 'Tipo', 'Costo Real'],
      ...project.materiales.map(m => [
        this.sanitizeCell(m.nombre),
        `${this.sanitizeCell(m.tipoMaterial)} (Merma: ${m.porcentajeMerma}%)`,
        (m.costoCalculado || 0).toFixed(2)
      ]),
      ['', '', ''],
      ['--- INSUMOS ---', '', ''],
      ['Nombre', 'Rendimiento', 'Costo Prorrateado'],
      ...project.insumos.map(i => [
        this.sanitizeCell(i.nombre),
        `${i.rendimiento} usos`,
        (i.precio / (i.rendimiento || 1)).toFixed(2)
      ]),
      ['', '', ''],
      ['--- TAPETES DE CORTE ---', '', ''],
      ...project.tapetes.map(t => [
        this.sanitizeCell(t.tapeteNombre),
        `${t.pasadasEnProyecto} pasadas`,
        (t.costoCalculado || 0).toFixed(2)
      ]),
      ['', '', ''],
      ['--- MANO DE OBRA ---', '', ''],
      ...project.manoDeObra.map(l => [this.sanitizeCell(l.descripcion), `${l.tiempoMinutos} min`, '']),
      ['', '', ''],
      ['--- RESUMEN FINANCIERO ---', '', ''],
      ['Costo Tapetes de Corte', '', project.costoTapetes.toFixed(2)],
      ['Depreciacion Equipos', '', project.depreciacionEquipos.toFixed(2)],
      ['Costos Fijos Prorrateados', '', project.costoFijoProrrateado.toFixed(2)],
      ['', '', ''],
      ['COSTO TOTAL PROYECTO', '', project.totalCosto.toFixed(2)],
      ['PRECIO SUGERIDO (PVP)', '', project.precioSugerido.toFixed(2)],
      ['PRECIO POR UNIDAD', '', (project.precioSugerido / (project.unidadesProduced || 1)).toFixed(2)]
    ];

    const csvContent = rows.map(row => row.join(';')).join('\n');
    this.downloadFile(csvContent, `Presupuesto_${project.nombre.replace(/\s+/g, '_')}.csv`);
  }

  /**
   * Protege contra CSV Injection (Excel Formula Injection)
   * Si una celda empieza por caracteres que Excel interpreta como fórmula,
   * le anteponemos una comilla simple para forzar que sea texto.
   */
  private sanitizeCell(value: string | undefined): string {
    if (!value) return '';
    const unsafeChars = ['=', '+', '-', '@', '\t', '\r'];
    if (unsafeChars.some(char => value.startsWith(char))) {
      return `'${value}`;
    }
    return value;
  }

  private downloadFile(content: string, fileName: string): void {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
