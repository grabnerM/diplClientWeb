import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const baseUrl = 'http://localhost:8080/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  public login(body) {
    this.http.post(baseUrl + 'jwt', body, { responseType: 'text' }).subscribe( result => {
      if ( true ) {
        localStorage.setItem('token', result)
        console.log(result)
        this.router.navigate['home']
      } 
    })
  }

  /* Aufrufe mit Token
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))

    return this.http.get<boolean>(baseUrl + 'tokenService/login', {headers})
  */
}
