import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const baseUrl = 'http://localhost:8080/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(body) {
    return this.http.post(baseUrl + 'jwt', body, { responseType: 'text' })
  }

  public logout() {
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }

  /* Aufrufe mit Token
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<boolean>(baseUrl + 'tokenService/login', {headers})
  */
}
