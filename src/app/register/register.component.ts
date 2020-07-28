import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor( private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onRegister(username: string, password: string, confirmPassword: string) {
    if (this.registerForm.invalid) {
      return;
    }
    if(password !== confirmPassword){
      return;
    }
    this.authService.register(username, password).subscribe(result => {
      if (result.value === 'Registration successful') {
        this.router.navigate(['/login']);
      } else {
        console.log(result.value);
      }
    });
  }
}
