import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  link = ""

  constructor(private router: Router) { }

  ngOnInit(){
    this.islogin()
    this.link = 'localhost:4200/about/'+localStorage.getItem('token')

  }

  public islogin(){
    if(this.router.url == "/" || this.router.url == "/login"){
      return false;
    }
    return true;
  }

  copy(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  isLoggedIn(){
    console.log(localStorage.getItem('token'))
    if(localStorage.getItem('token')){
      console.log(true)
      return true
    }
    return false
  }

  login(){
    this.router.navigate(['login'])
  }

  logout(){
    localStorage.removeItem('token')
    this.router.navigate(['login'])
  }
}