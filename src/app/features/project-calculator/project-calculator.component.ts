import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
  ],
  templateUrl: './project-calculator.component.html',
  styleUrls: ['./project-calculator.component.scss'],
})
export class ProjectCalculatorComponent implements OnInit, OnDestroy {
  public unitsProduced = 1;
  public jobHour = 40;
  public marginPercent=20
  public projectName = 'Nuevo';
  public sheetType = 'a4';
  public manyCuadrados = 0;
  public services: CustomServices[] = [];
  public materials: CustomMaterial[] = [];
  public insumos: Insumo[] = [{ name: '', price: 0, yield: 1 }];
  public machines: Equipment[] = [];
  public fixedCosts: FixedCost[] = [
    { name: 'Agua', price: 0 },
    { name: 'Electricidad', price: 0 },
  ];

  public typeServices = [
    { name: 'agua', price: '', model: '', lifespan: '', used: false },
    { name: 'electricidad', price: '', model: '', lifespan: '', used: false },
    { name: 'alquiler', price: '', model: '', lifespan: '', used: false },
    { name: 'otros', price: '', model: '', lifespan: '', used: false },
  ];

  public typesMachines = [
    { name: 'Cricut', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Siluette', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Brother', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Xtool', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Impresora', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Otro ', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Plotter ', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Laser ', price: '', model: '', lifespan: '', inUse: false },
    { name: 'Otro cnc', price: '', model: '', lifespan: '', inUse: false },
    { name: 'N/A', price: '', model: '', lifespan: '', inUse: false },
  ];

  public sheetTypes = [
    { label: 'A2', value: 'a2', ancho: 42, largo: 59.4 },
    { label: 'A1', value: 'a1', ancho: 59.4, largo: 84.1 },
    { label: 'A4', value: 'a4', ancho: 21, largo: 29.7 },
    { label: 'A3', value: 'a3', ancho: 29.7, largo: 42 },
    { label: 'Personalizado', value: 'personalizado' },
  ];

  public typesMaterial = [
    { label: 'material cuadrado', value: 'cuadrado' },
    { label: 'material por metro', value: 'metro' },
    { label: 'material por unidad', value: 'unidad' },
    { label: 'material por paquete', value: 'paquete' },
    { label: 'material por peso', value: 'peso' },
  ];

  public typesUnit = [
    { label: 'KG', value: 'kilogramo' },
    { label: 'GR', value: 'gramo' },
    { label: 'L', value: 'litro' },
  ];

  public laborTime = 0;
  public hourlyRate = 0;
  public cutType: 'manual' | 'cricut' = 'manual';
  public cutTime = 0;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('papeleria-persist');

      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);

          this.machines = [...parsed.machines];
          this.materials=[...parsed.materials]

          const serviceNames = new Set(parsed.services.map((s: any) => s.name));
          const uniqueFixedCosts = parsed.fixedCosts.filter(
            (fc: any) => !serviceNames.has(fc.name)
          );

          this.services = [...parsed.services, ...uniqueFixedCosts];
        } catch (error) {
          console.error('Error parsing localStorage data:', error);
        }
      }
    }
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined') {
      this.savePersistentData();
    }
  }

  public savePersistentData() {
    const persistent = {
      fixedCosts: this.fixedCosts,
      machines: this.machines,
      materials: this.materials,
      insumos: this.insumos,
      services: this.services,
    };
    localStorage.setItem('papeleria-persist', JSON.stringify(persistent));
  }

  public addMachine() {
    this.machines.push({
      name: '',
      price: 0,
      lifespan: 0,
      model: 'string',
      years: 0,
      inUse: false,
      depreciation: 0,
    });
    this.savePersistentData();
  }

  public addCustomService(): void {
    this.services.push({ name: '', type: '', price: 0, days: 0 });
    this.savePersistentData();
  }

  public addCustomMaterial(): void {
    this.materials.push({
      name: '',
      type: 'unidad',
      price: 0,
      quantity: 1,
      quantityUse: 0,
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      multiply: 1,
      sheetType: null,
      units: null,
      packageUnits: null,
      single: 0,
    });
    this.savePersistentData();
  }

  public addInsumo(): void {
    this.insumos.push({ name: '', price: 0, yield: 1 });
    this.savePersistentData();
  }

  public removeMaterial(index: number): void {
    this.materials.splice(index, 1);
    this.savePersistentData();
  }

  public removeMachine(index: number): void {
    this.machines.splice(index, 1);
    this.savePersistentData();
  }

  public removeService(index: number): void {
    this.services.splice(index, 1);
    this.savePersistentData();
  }

  public removeInsumo(index: number): void {
    this.insumos.splice(index, 1);
    this.savePersistentData();
  }

  public calculateDepreciation(i: number): void {
    const machine = this.machines[i];
    const { price, years, lifespan } = machine;

    if (!price || !years || !lifespan || years <= 0 || lifespan <= 0) {
      machine.depreciation = 0;
      return;
    }

    const monthlyDepreciation = price / (years * 12);
    const depreciationPerProject = monthlyDepreciation / lifespan;
    machine.depreciation = parseFloat(depreciationPerProject.toFixed(2));
  }

  // public calculateFixedCost(): number {
  //   if (this.unitsProduced <= 0) return 0;

  //   let totalFixedCosts = 0;
  //   this.services.forEach((service) => {
  //     const cost = (service.price || 0) / (service.days || 1);
  //     totalFixedCosts += cost;
  //   });

  //   return totalFixedCosts / this.unitsProduced / this.jobHour;
  // }
//   public calculateFixedCost(): number {
//   if (this.unitsProduced <= 0 || this.jobHour <= 0) return 0;

//   let totalFixedCosts = 0;
//   this.services.forEach((service) => {
//     const days = service.days || 1;
//     const cost = (service.price || 0) / days;
//     totalFixedCosts += cost;
//   });

//   return totalFixedCosts / this.unitsProduced / this.jobHour;
// }
public calculateFixedCostWithProfit(): number {
  if (this.unitsProduced <= 0 || this.jobHour <= 0) return 0;

  let totalFixedCosts = 0;

  this.services.forEach((service) => {
    const days = service.days || 1;
    const cost = (service.price || 0);
    const proratedCost = cost / days;

    totalFixedCosts += proratedCost;
  });

  const costPerUnitPerHour = totalFixedCosts / this.unitsProduced / this.jobHour;
  console.log("🚀 ~ ProjectCalculatorComponent ~ calculateFixedCostWithProfit ~ costPerUnitPerHour:", costPerUnitPerHour)

  // Aplicar margen si es mayor a 0
  if (this.marginPercent > 0) {
    return costPerUnitPerHour * (1 + this.marginPercent / 100);
  }

  return costPerUnitPerHour;
}


  public calculateCostByType(data: CustomMaterial): number {
    if (!data) return 0;

    switch (data.type) {
      case 'cuadrado':
        if (data.sheetType && data.width > 0 && data.height > 0) {
          const areaHoja = data.sheetType.ancho * data.sheetType.largo;
          const areaItem = data.width * data.height;
          this.manyCuadrados= (areaHoja / areaItem)
          return this.manyCuadrados ;
        }
        return 0;

      case 'metro':
        return data.length || 0;

      case 'unidad':
        return data.single || 0;

      case 'paquete':
        return data.quantityUse > 0 ? data.quantity / data.quantityUse : 0;

      case 'peso':
        return data.weight || 0;

      default:
        return 0;
    }
  }

  // public calculateCostByType(data: CustomMaterial): number {
  //   if (!data) return 0;

  //   switch (data.type) {
  //     case 'cuadrado':
  //       if (data && data.sheetType) {
  //         const areaHoja = data.sheetType.ancho * data.sheetType.largo;
  //         const areaItem = data.width * data.height;
  //         this.manyCuadrados = areaHoja / areaItem;
  //         return this.manyCuadrados;
  //       } else {
  //         return 0;
  //       }

  //     case 'metro':
  //       if (data && data.length) {
  //         return data.length;
  //       } else {
  //         return 0;
  //       }
  //     case 'unidad':
  //       if (data && data.single) {
  //         return data.single;
  //       } else {
  //         return 0;
  //       }
  //     case 'paquete':
  //       if (data && data.quantity) {
  //         return data.quantity / data.quantityUse;
  //       } else {
  //         return 0;
  //       }
  //     case 'peso':
  //       if (data && data.weight && data.units == 'kg') {
  //         return data.weight;
  //       } else if (data && data.weight && data.units == 'gr') {
  //         return data.weight;
  //       } else if (data && data.weight && data.units == 'l') {
  //         return data.weight;
  //       } else {
  //         return 0;
  //       }

  //     default:
  //       return 0;
  //   }
  // }

  public calculateCostPerUnit(): number {
    const fixedCosts = this.calculateFixedCostWithProfit();
    const materialsCost = this.materials.reduce(
      (total, mat) => total + (mat.price || 0),
      0
    );
    const insumosCost = this.insumos.reduce((total, insumo) => {
      return total + (insumo.price || 0) / (insumo.yield || 1);
    }, 0);
    const depreciationCost = this.machines.reduce((total, machine) => {
      return total + (machine.depreciation || 0);
    }, 0);

    return fixedCosts + materialsCost + insumosCost + depreciationCost;
  }

  // public calculateTotalCost(): number {
  //   return this.calculateCostPerUnit();
  // }
  public calculateTotalCost(): number {
    return this.calculateCostPerUnit() * this.unitsProduced;
  }
}

interface CustomServices {
  name: string;
  type: string;
  price: number;
  days: number;
}

interface CustomMaterial {
  name: string;
  type: string;
  price: number;
  quantity: number;
  quantityUse: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  multiply: number;
  sheetType: any;
  units: any;
  packageUnits: any;
  single: any;
}

interface Insumo {
  name: string;
  price: number;
  yield: number;
}

interface FixedCost {
  name: string;
  price: number;
}

interface Equipment {
  name: string;
  price: number;
  lifespan: number;
  model: string;
  years: number;
  inUse: boolean;
  depreciation: number;
}
