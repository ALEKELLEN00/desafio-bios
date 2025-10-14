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

  private getDescricaoCondicao(codigo: number): string {
    const mapa: { [key: number]: string } = {
      0: 'Céu limpo',
      1: 'Parcialmente limpo',
      2: 'Parcialmente nublado',
      3: 'Encoberto',
      45: 'Nevoeiro',
      48: 'Nevoeiro com deposição',
      51: 'Chuvisco leve',
      53: 'Chuvisco moderado',
      55: 'Chuvisco denso',
      61: 'Chuva leve',
      63: 'Chuva moderada',
      65: 'Chuva forte',
      71: 'Neve leve',
      73: 'Neve moderada',
      75: 'Neve intensa',
      80: 'Pancadas de chuva leves',
      81: 'Pancadas de chuva moderadas',
      82: 'Pancadas de chuva fortes',
      95: 'Trovoadas',
      96: 'Trovoadas com granizo leve',
      99: 'Trovoadas com granizo intenso'
    };
    return mapa[codigo] ?? 'Condição desconhecida';
}

  private getWeatherByCoords(lat: number, lon: number, cidade: string) {
    console.log("latitude:", lat);
    console.log("longitude:", lon);
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto`;

    return this.http.get<any>(weatherUrl).pipe(
      map((data) => {
        const current = data.current;
        const result: WeatherResult = {
          cidade,
          temperaturaC: current.temperature_2m,
          condicao: this.getDescricaoCondicao(current.weathercode),
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



