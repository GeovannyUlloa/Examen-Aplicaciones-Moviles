import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { initializeApp } from 'firebase/app';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
// import { AppHeaderComponent } from './app-header/app-header.component';
export const firebaseConfig = {
  apiKey: "AIzaSyBK0TMIzr-C65HOhwpNj9wRjZE6Ytb3V5o",
  authDomain: "tellevoapp-1b9a6.firebaseapp.com",
  projectId: "tellevoapp-1b9a6",
  storageBucket: "tellevoapp-1b9a6.firebasestorage.app",
  messagingSenderId: "604340306468",
  appId: "1:604340306468:web:3ed7f87927d328efeeceb1"
};

initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent], // [AppHeaderComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({ mode : 'md' }), 
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
