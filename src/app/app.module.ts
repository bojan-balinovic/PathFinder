import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './components/grid/grid.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NodeFactoryService } from './services/node-factory-service';
import { APP_BASE_HREF } from '@angular/common';
import { baseHrefFactory } from './factories/base-href-factory';

@NgModule({
  declarations: [AppComponent, GridComponent, NavbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [
    NodeFactoryService,
    {
      provide:APP_BASE_HREF,
      useFactory:baseHrefFactory
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
