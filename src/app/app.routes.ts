import { Routes } from '@angular/router';
import { CalculatorComponent } from './features/calculator/calculator.component';
import { HistoryComponent } from './features/history/history.component';
import { ProjectCalculatorComponent } from './features/project-calculator/project-calculator.component';

export const routes: Routes = [
  { path: '', redirectTo: 'calcular', pathMatch: 'full' },
  { path: 'calcular', component: CalculatorComponent },
  { path: 'calculadora', component: ProjectCalculatorComponent },
  { path: 'historial', component: HistoryComponent },
];
