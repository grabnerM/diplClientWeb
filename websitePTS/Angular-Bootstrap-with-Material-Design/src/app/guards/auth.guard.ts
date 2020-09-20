import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor (
    public router: Router
  ) { }

  canActivate(): boolean {
    if ( !this.isAuthenticated() ) {
      this.router.navigate(['login'])
      return false
    }

    return true
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token')
    if ( token && token != 'null' )
      return !new JwtHelperService().isTokenExpired(token)
    return false
  }
  
}
