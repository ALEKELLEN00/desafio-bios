// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),      // integra providers do Ionic no root injector
    provideHttpClient(),                             // fornece HttpClient (standalone)
    provideRouter(routes),                           // roteamento
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // rota ionic
  ]
}).catch(err => console.error(err));
