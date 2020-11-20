import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { FormsModule } from '@angular/forms';
import { SenderComponent } from './components/sender/sender.component';
<<<<<<< HEAD
import { HistoryComponent } from './history/history.component';
=======
<<<<<<< Updated upstream
=======
import { HistoryComponent } from './history/history.component';
import { RouteCardComponent } from './components/route-card/route-card.component';
>>>>>>> Stashed changes
>>>>>>> b652ca6... History of Routes now has only 2 Markers and a make map big Funktion

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
<<<<<<< HEAD
    SenderComponent,
    HistoryComponent
=======
<<<<<<< Updated upstream
    SenderComponent
=======
    SenderComponent,
    HistoryComponent,
    RouteCardComponent
>>>>>>> Stashed changes
>>>>>>> b652ca6... History of Routes now has only 2 Markers and a make map big Funktion
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
