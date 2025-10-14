import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonText,
  IonSpinner,
  IonItem
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { WeatherService } from '../services/weather.service'; // ajuste o caminho se necessário
import { WeatherResult } from '../models/weather.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonContent,
    IonText,
    IonSpinner,
    IonItem,
    DatePipe
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage {
termo = '';
loading = false;
error = '';
weather: any = null;

constructor(private weatherService: WeatherService) {}

buscarClima() {
console.log('BuscarClima foi chamado com termo:', this.termo);  
this.error = '';
this.weather = null;

if (!this.termo.trim()) return;

this.loading = true;

this.weatherService.getWeather(this.termo).subscribe({
    next: (data) => {
      this.weather = data;
      this.loading = false;
      },
    error: (err) => {
      this.error = err.message;
      this.loading = false;
      }
    });

/*setTimeout(() => {
this.weather = {
  cidade: 'Exemplo',
  temperaturaC: 25.5,
  condicao: 'Ensolarado',
  umidade: 50,
  ventoMs: 3,
  atualizadoEm: new Date().toISOString()
};
this.loading = false;
}, 1500);*/
}}
