import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  loginUsername: string = ''
  loginPassword: string = ''

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  public login() {
    const body = { username: this.loginUsername, password: this.loginPassword }

    console.log(body)

    this.auth.login(body)
  }

}
