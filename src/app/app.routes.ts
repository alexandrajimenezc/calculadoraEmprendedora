import { Routes } from '@angular/router';
import { CalculatorComponent } from './features/calculator/calculator.component';
import { HistoryComponent } from './features/history/history.component';
import { ProjectCalculatorComponent } from './features/project-calculator/project-calculator.component';

export const routes: Routes = [
  { path: '', redirectTo: 'calculadora', pathMatch: 'full' },
  { path: 'calculadora', component: ProjectCalculatorComponent },
  { path: 'simple', component: CalculatorComponent },
  { path: 'historial', component: HistoryComponent },
];

