import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Receiver } from '../class/receiver';

const baseUrl = 'https://v2202010130694129625.goodsrv.de/'

@Injectable({
  providedIn: 'root'
})
/*
  Autor: Jakob Hocheneder
  Titel: Authentication Service
  Beschreibung: Service für die authenticate Requests an den Server
*/
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * Login request
   * @param body Email und verschlüsseltes Passwort
   */
  public login(body) {
    return this.http.post(baseUrl + 'authenticate/receiverlogin', body, { responseType: 'text' })
  }

  /**
   * Register request
   * @param body Alle angegebenen Information
   */
  public register(body){
    return this.http.post(baseUrl + "authenticate/createReceiver", body, { responseType: 'text'})
  }

  /**
   * Entfernung des Tokens aus dem localStorage und Routing zur Login-Page
   */
  public logout() {
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }

  /**
   * Request an den Server der die Informationen des Auftraggebers zurück sendet
   */
  public getUser() {
    let token: string = localStorage.getItem('token')
    
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    
    return this.http.get<Receiver>(baseUrl + 'receiver/getUser', {headers})
  }
}
