export interface WeatherResult {
  cidade: string;
  temperaturaC: number;
  condicao: string;
  umidade: number;
  ventoMs: number;
  atualizadoEm: string; // ISO string ou formatado
}
