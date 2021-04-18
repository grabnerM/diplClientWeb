import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/*
  Autor: Jakob Hocheneder
  Titel: App Component
  Beschreibung: Haupt Component der WebApp
*/
export class AppComponent {

  constructor(private router: Router) { }

  /**
   * Überprüfen ob der Nutzer auf der Login page ist, nach laden der Website
   */
  ngOnInit(){
    this.islogin()
  }

  /**
   * Überprüfen ob der Nutzer gerade auf der Login page ist, damit die Navbar ausgeblendet wird
   */
  public islogin(){
    if(this.router.url == "/" || this.router.url == "/login"){
      return false;
    }
    return true;
  }

  /**
   * Überprüfen üb der token im localStorage gesetzt ist
   */
  isLoggedIn(){
    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')){
      console.log(true)
      return true
    }
    return false
  }

  /**
   * Zur Login page navigieren
   */
  login(){
    this.router.navigate(['login'])
  }

  /**
   * Token aus dem localStorage löschen und zur Login page navigieren
   */
  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }
}