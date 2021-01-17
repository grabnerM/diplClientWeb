import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { sha512 } from 'js-sha512';
import { match } from 'src/app/validators/match';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
  registerForm: FormGroup;

  loginEmail: string = ''
  loginPassword: string = ''

  islogin: boolean = false

  constructor(
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: new FormControl(null, [Validators.minLength(3), Validators.maxLength(40)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmpassword: new FormControl(null, [Validators.required]),
      firstname: new FormControl(null, [Validators.minLength(2)]),
      lastname: new FormControl(null, [Validators.minLength(2)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl(null, [Validators.maxLength(15), Validators.minLength(8), Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$")]),
      zip: new FormControl(null, [Validators.minLength(4), Validators.maxLength(5)]),
      street: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      housenr: new FormControl(null, [Validators.maxLength(5)]),
      sex: new FormControl(null, [Validators.maxLength(12)]),
      city: new FormControl(null, [Validators.minLength(3)])
    },{
      validator: match('password', 'confirmpassword')
    });
  }
  
  optionsSex = [
    { value: 'M', label: 'Mann' },
    { value: 'F', label: 'Frau' },
    { value: 'D', label: 'Divers' },
  ];

  public login() {
    console.log("login")

    const body = { email: this.loginEmail, password: sha512(this.loginPassword) }

    this.auth.login(body).subscribe( result => {
      if ( result != 'false' ) {
        localStorage.setItem('token', result)
        this.router.navigate(['home'])
      } 
    })
  }

  public register() {
    console.log(this.registerForm.controls['sex'].value)
    if(this.registerForm.valid){
      const regBody = {
        email: this.registerForm.controls['email'].value,
        firstname: this.registerForm.controls['firstname'].value,
        housenr: this.registerForm.controls['housenr'].value,
        lastname: this.registerForm.controls['lastname'].value,
        password: sha512(this.registerForm.controls['password'].value),
        number: this.registerForm.controls['phone'].value,
        sex: this.registerForm.controls['sex'].value,
        street: this.registerForm.controls['street'].value,
        username: this.registerForm.controls['username'].value,
        zip: this.registerForm.controls['zip'].value,
        city: this.registerForm.controls['city'].value
      }

      this.auth.register(regBody).subscribe(data => {
        if(data) {
          localStorage.setItem('token', data)
          this.router.navigate(['home'])
        }
      })
    }
  }

}
