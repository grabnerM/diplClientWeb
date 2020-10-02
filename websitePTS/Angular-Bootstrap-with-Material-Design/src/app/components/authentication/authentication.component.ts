import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  loginEmail: string = ''
  loginPassword: string = ''

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public login() {
    const body = { username: this.loginEmail, password: this.loginPassword }

    this.auth.login(body).subscribe( result => {
      if ( result != 'false' ) {
        localStorage.setItem('token', result)
        console.log(result)
        this.router.navigate(['home'])
      } 
    })
  }

}
