// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, switchMap } from 'rxjs';
import { WeatherResult } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) {}

    // Detecta se é CEP (8 dígitos) ou cidade
  getWeather(termo: string) {
    const isCep = /^\d{8}$/.test(termo);
    return isCep ? this.getByCep(termo) : this.getByCity(termo);
  }

  // 1) buscar via cidade  (nome)
  getByCity(cidade: string) {
     const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

    return this.http.get<any>(geoUrl).pipe(
      switchMap((data : any) => {
        if (!data.results || data.results.length === 0) {
          throw new Error('Cidade não encontrada.');
        }

        const location = data.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const nomeCidade = location.name;

        return this.getWeatherByCoords(latitude, longitude, nomeCidade);
      }),
      catchError(err => throwError(() => new Error('Erro ao buscar localização')))
    );
  }

  // 2) buscar por CEP -> chamar ViaCEP para achar localidade -> depois chamada clima por city/latlon
  getByCep(cep: string) {
    const viaCepUrl = `https://viacep.com.br/ws/${cep}/json/`;

    return this.http.get<any>(viaCepUrl).pipe(
      switchMap((data : any) => {
        if (data.erro) throw new Error('CEP inválido.');
        const cidade = data.localidade;
        return this.getByCity(cidade);
      }),
      catchError(err => throwError(() => new Error('Erro ao buscar o CEP')))
    );
  }
    
  // seguir com geocoding → clima...
   
  private mapOpenWeather(data: any): WeatherResult {
    return {
      cidade: data.name,
      temperaturaC: data.main.temp,
      condicao: data.weather[0].description,
      umidade: data.main.humidity,
      ventoMs: data.wind.speed,
      atualizadoEm: new Date().toISOString()
    };
  }

  private handleError(err: any) {
    if (err?.status === 404) return throwError(() => new Error('Cidade ou CEP não encontrado.'));
    if (err?.status === 400) return throwError(() => new Error('CEP inválido.'));
    return throwError(() => new Error('Falha de rede. Tente novamente.'));
  }

  private getWeatherByCoords(lat: number, lon: number, cidade: string) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`;

    return this.http.get<any>(weatherUrl).pipe(
      map((data) => {
        const current = data.current;
        const result: WeatherResult = {
          cidade,
          temperaturaC: current.temperature_2m,
          condicao: '—', // Open-Meteo não retorna descrição textual
          umidade: current.relative_humidity_2m,
          ventoMs: current.windspeed_10m,
          atualizadoEm: new Date().toISOString()
        };
        return result;
      }),
      catchError(err => throwError(() => new Error('Erro ao buscar clima')))
    );
  }
}



