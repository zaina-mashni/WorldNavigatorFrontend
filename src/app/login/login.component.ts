import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {ReplyInterface} from '../interface/reply.interface';
import {AuthenticationService} from '../service/authentication.service';
import {PlayerInterface} from '../interface/player.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  constructor( private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogin(name: string, pass: string) {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.login(name, pass).subscribe(result => {
      console.log(JSON.stringify(result));
      if (result.value === 'Authentication successful') {
        const player: PlayerInterface = {
          username: name,
          password: pass,
          worldName: '',
          isAdmin: false
        };
        this.authService.onLogin(player);
        this.router.navigate(['/join']);
      } else {
        console.log('wrong username or password.');
      }
    });
  }
}
