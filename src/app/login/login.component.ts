import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {PlayerInterface} from '../interface/player.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submitted = false;
  result = '';
  loginForm: FormGroup;
  constructor( private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogin(name: string, pass: string) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.result = 'Username and password can not be empty.';
      return;
    }
    this.authService.login(name, pass).subscribe(result => {
      this.result = result.value;
      if (result.status === 'OK') {
        const player: PlayerInterface = {
          username: name,
          password: pass,
          worldName: '',
          isAdmin: false,
          isPlaying: false
        };
        this.authService.onLogin(player);
        this.router.navigate(['/join']);
      }
    });
  }
}
