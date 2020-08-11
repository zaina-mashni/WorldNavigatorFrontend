import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {GameService} from '../service/game.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isJoined = false;
  constructor(private authService: AuthenticationService,
              private gameService: GameService) {
    this.authService.getLoggedIn.subscribe(result => {
      this.isLoggedIn = result !== undefined;
    });
    this.gameService.getJoined.subscribe(result => {
      this.isJoined = result !== '';
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
