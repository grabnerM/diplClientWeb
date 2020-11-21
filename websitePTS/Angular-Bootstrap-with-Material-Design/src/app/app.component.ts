import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router) { }

  ngOnInit(){
    this.islogin()
  }

  public islogin(){
    if(this.router.url == "/" || this.router.url == "/login"){
      return false;
    }
    return true;
  }

  logout(){
    localStorage.setItem('token', null)
    this.router.navigate(['login'])
  }
}