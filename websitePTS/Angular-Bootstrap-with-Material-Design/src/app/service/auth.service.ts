import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Receiver } from '../class/receiver';

const baseUrl = 'http://localhost:8080/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private receiver: Receiver

  public login(body) {
    return this.http.post(baseUrl + 'authenticate/receiverlogin', body, { responseType: 'text' })
  }

  public logout() {
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }

  public getUser() {
    let token: string = localStorage.getItem('token')
    
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    
    console.log(headers)
    return this.http.get<Receiver>(baseUrl + 'receiver/getUser', {headers})
  }

  /* Aufrufe mit Token
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<boolean>(baseUrl + 'tokenService/login', {headers})
  */
}
