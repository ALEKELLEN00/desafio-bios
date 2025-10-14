import { Routes } from '@angular/router';
import { HomePage } from './home/home.page'; // ou HomeComponent, se você renomeou

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage
  }
];
