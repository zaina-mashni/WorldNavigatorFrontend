import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isJoined = false;
  constructor(private authService: AuthenticationService) {
    this.authService.getLoggedIn.subscribe(result => {
      this.isLoggedIn = result !== undefined;
      if (this.isLoggedIn) {
        this.isJoined = this.authService.getCurrentUser().worldName !== '';
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.isJoined = this.authService.getCurrentUser().worldName !== '';
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
