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
  submitted = false;
  result = '';
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
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.result = 'Username, password and confirm password can not be empty.';
      return;
    }
    if (password !== confirmPassword) {
      this.result = 'Password and confirm Password should match.';
      return;
    }
    this.authService.register(username, password).subscribe(result => {
      this.result = result.value;
      if (result.status === 'OK') {
        this.router.navigate(['/login']);
      }
    });
  }
}
