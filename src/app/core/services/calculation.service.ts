import { Injectable } from '@angular/core';
import { Material, Insumo, LaborTask, Equipment, TapeteUsoProyecto, SoftwareSuscripcion } from '../models/material';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  calculateMaterialCost(mat: Material): number {
    let baseCost = 0;
    const wasteFactor = 1 + ((mat.porcentajeMerma || 0) / 100);

    switch (mat.tipoMaterial) {
      case 'hojaCompleta':
        if (mat.hojasTotalesCompradas && mat.hojasUsadasEnProyecto) {
          baseCost = (mat.costo / mat.hojasTotalesCompradas) * mat.hojasUsadasEnProyecto;
        }
        break;
      case 'cuadrado':
        if (mat.anchoHoja && mat.largoHoja && mat.anchoUtilizado && mat.largoUtilizado) {
          const areaTotal = mat.anchoHoja * mat.largoHoja;
          const areaRecorte = mat.anchoUtilizado * mat.largoUtilizado;
          const cantRecortes = mat.cantidadRecortes || 1;
          baseCost = (mat.costo / areaTotal) * (areaRecorte * cantRecortes);
        }
        break;
      case 'metro':
        if (mat.largoMaterial && mat.largoUtilizadoMetro) {
          baseCost = (mat.costo / mat.largoMaterial) * mat.largoUtilizadoMetro;
        }
        break;
      case 'paquete':
        if (mat.cantidadTotalEnPaquete && mat.cantidadUtilizada) {
          baseCost = (mat.costo / mat.cantidadTotalEnPaquete) * mat.cantidadUtilizada;
        }
        break;
      case 'bote':
      case 'peso':
        if (mat.contenidoTotal && mat.contenidoUsado) {
          baseCost = (mat.costo / mat.contenidoTotal) * mat.contenidoUsado;
        }
        break;
      case 'unidad':
        if (mat.cantidadComprada && mat.cantidadUsadaUnidad) {
          baseCost = (mat.costo / mat.cantidadComprada) * mat.cantidadUsadaUnidad;
        }
        break;
    }

    return parseFloat((baseCost * wasteFactor).toFixed(4));
  }

  calculateTapeteCost(tapete: TapeteUsoProyecto): number {
    return parseFloat((tapete.precioPorPasada * tapete.pasadasEnProyecto).toFixed(4));
  }

  calculateLaborCost(tasks: LaborTask[], hourlyRate: number): number {
    if (!tasks || tasks.length === 0) return 0;
    const totalMinutes = tasks.reduce((sum, task) => sum + (task.tiempoMinutos || 0), 0);
    return parseFloat(((totalMinutes / 60) * hourlyRate).toFixed(2));
  }

  calculateEquipmentDepreciation(eq: Equipment): number {
    if (!eq.precio || !eq.anosVidaUtil || !eq.usoHorasMes) return 0;
    const totalHoursLife = eq.anosVidaUtil * 12 * eq.usoHorasMes;
    return parseFloat((eq.precio / totalHoursLife).toFixed(4));
  }

  /**
   * Calcula el costo mensual total de software.
   * Las suscripciones anuales se dividen entre 12.
   */
  calculateSoftwareMonthlyCost(subscriptions: SoftwareSuscripcion[]): number {
    return parseFloat(
      subscriptions.reduce((sum, s) => {
        const monthly = s.ciclo === 'anual' ? (s.precio || 0) / 12 : (s.precio || 0);
        return sum + monthly;
      }, 0).toFixed(2)
    );
  }

  /**
   * Calcula el costo fijo prorrateado (alquiler + software + internet...)
   * según el tiempo que se dedica al proyecto vs el total de horas de trabajo mensual.
   */
  calculateOverhead(
    fixedCosts: number,
    softwareMonthlyCost: number,
    monthlyLaborHours: number,
    projectMinutes: number
  ): number {
    if (!monthlyLaborHours || monthlyLaborHours <= 0 || !projectMinutes) return 0;
    const totalFixed = (fixedCosts || 0) + (softwareMonthlyCost || 0);
    const costPerHour = totalFixed / monthlyLaborHours;
    return parseFloat(((projectMinutes / 60) * costPerHour).toFixed(2));
  }

  calculateSuggestedPrice(totalCost: number, profitMargin: number): number {
    return parseFloat((totalCost * (1 + profitMargin / 100)).toFixed(2));
  }
}
