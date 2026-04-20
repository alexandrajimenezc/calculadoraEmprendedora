import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Project, WorkshopConfig, Material, Insumo, LaborTask } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private primaryColor: [number, number, number] = [205, 147, 153]; // #cd9399 (Rosa profundo)
  private secondaryColor: [number, number, number] = [88, 52, 42];  // #58342a (Marrón texto)
  private lightPink: [number, number, number] = [243, 206, 206];   // #f3cece (Rosa claro)

  exportProjectToPdf(project: Project, config: WorkshopConfig, currencySymbol: string) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- HEADER ---
    doc.setFillColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Calculadora Emprendedora', 15, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Presupuesto Profesional de Diseño y Creación', 15, 30);

    // --- PROJECT TITLE ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(project.nombre || 'Sin nombre', 15, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
    doc.text(`Fecha: ${new Date(project.fecha).toLocaleDateString()}`, 15, 62);
    doc.text(`Unidades: ${project.unidadesProduced || 1}`, 150, 62);

    let currentY = 70;

    // --- MATERIALS TABLE ---
    if (project.materiales && project.materiales.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      doc.text('MATERIALES', 15, currentY);
      currentY += 5;

      const matData = project.materiales.map(m => [
        m.nombre,
        this.getMaterialTypeLabel(m.tipoMaterial),
        `${(m.costoCalculado || 0).toFixed(2)} ${currencySymbol}`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Material', 'Tipo', 'Costo']],
        body: matData,
        theme: 'striped',
        headStyles: { fillColor: this.primaryColor, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 15, right: 15 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // --- INSUMOS TABLE ---
    if (project.insumos && project.insumos.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      doc.text('INSUMOS Y EXTRAS', 15, currentY);
      currentY += 5;

      const insumoData = project.insumos.map(i => [
        i.nombre,
        `${(i.precio / (i.rendimiento || 1)).toFixed(2)} ${currencySymbol}`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Insumo', 'Costo prorrateado']],
        body: insumoData,
        theme: 'striped',
        headStyles: { fillColor: this.primaryColor, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 15, right: 15 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // --- LABOR TABLE ---
    if (project.manoDeObra && project.manoDeObra.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
      doc.text('MANO DE OBRA', 15, currentY);
      currentY += 5;

      const laborData = project.manoDeObra.map(l => [
        l.descripcion,
        `${l.tiempoMinutos} min`
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['Tarea', 'Tiempo']],
        body: laborData,
        theme: 'striped',
        headStyles: { fillColor: this.primaryColor, textColor: 255 },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 15, right: 15 }
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // --- SUMMARY BOX ---
    const summaryBoxWidth = 80;
    const summaryBoxX = pageWidth - summaryBoxWidth - 15;
    
    // Check if we need a new page
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFillColor(this.lightPink[0], this.lightPink[1], this.lightPink[2]);
    doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, 45, 3, 3, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.text('Costo Total:', summaryBoxX + 5, currentY + 10);
    doc.text(`${project.totalCosto.toFixed(2)} ${currencySymbol}`, summaryBoxX + summaryBoxWidth - 5, currentY + 10, { align: 'right' });

    doc.text(`Margen (${config.margenBeneficio}%):`, summaryBoxX + 5, currentY + 18);
    const profit = project.totalCosto * (config.margenBeneficio / 100);
    doc.text(`+ ${profit.toFixed(2)} ${currencySymbol}`, summaryBoxX + summaryBoxWidth - 5, currentY + 18, { align: 'right' });

    // COSTO INDIRECTO (Others)
    const indirects = project.costoTapetes + project.depreciacionEquipos + project.costoFijoProrrateado;
    if (indirects > 0) {
        doc.setFontSize(8);
        doc.setTextColor(this.secondaryColor[0], this.secondaryColor[1], this.secondaryColor[2]);
        doc.text('(Incluye amortización y gastos fijos)', summaryBoxX + 5, currentY + 24);
        doc.setTextColor(0,0,0);
        doc.setFontSize(10);
    }

    doc.setFillColor(this.primaryColor[0], this.primaryColor[1], this.primaryColor[2]);
    doc.rect(summaryBoxX, currentY + 30, summaryBoxWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PVP SUGERIDO', summaryBoxX + summaryBoxWidth / 2, currentY + 37, { align: 'center' });
    doc.text(`${project.precioSugerido.toFixed(2)} ${currencySymbol}`, summaryBoxX + summaryBoxWidth / 2, currentY + 42, { align: 'center' });

    // --- FOOTER ---
    doc.setTextColor(157, 106, 93); // #9d6a5d (Muted/Tierra)
    doc.setFont('helvetica', 'italic');
    
    doc.setFontSize(8);
    doc.text('Presupuesto válido por 15 días. *Los precios pueden variar según disponibilidad de materiales.', 15, 282);
    
    // Attribution with Instagram Icon (Smaller and slightly lower)
    doc.setFontSize(7);
    const footerText = 'Creado con Calculadora Emprendedora de @unregalodealex';
    const textWidth = doc.getTextWidth(footerText);
    const iconSize = 3;
    const startX = pageWidth - textWidth - 15 - iconSize - 2;
    const footerY = 287; 

    // Manual Instagram Icon Drawing (Minimalist Vector)
    doc.setDrawColor(157, 106, 93);
    doc.setLineWidth(0.2);
    doc.roundedRect(startX, footerY - 2.8, iconSize, iconSize, 0.8, 0.8, 'S'); // Outer box
    doc.circle(startX + iconSize/2, footerY - 1.3, 0.8, 'S'); // Inner circle
    doc.circle(startX + iconSize - 0.7, footerY - 2.1, 0.15, 'FD'); // Dot
    
    doc.text(footerText, startX + iconSize + 1.5, footerY);

    doc.save(`Presupuesto_${project.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private getMaterialTypeLabel(type: string): string {
    const labels: any = {
      hojaCompleta: 'Hoja',
      cuadrado: 'Área',
      unidad: 'Unidad',
      paquete: 'Paquete',
      bote: 'Bote',
      metro: 'Metro',
      peso: 'Peso'
    };
    return labels[type] || type;
  }
}
