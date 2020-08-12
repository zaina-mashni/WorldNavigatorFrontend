import { Component, OnInit } from '@angular/core';
import {ListGamesViewInterface} from '../interface/listGamesView.interface';
import {GameService} from '../service/game.service';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {PlayerInterface} from '../interface/player.interface';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  faUsers = faUsers;
  faUser = faUser;
  gameInfo: ListGamesViewInterface[] = [];
  result = '';
  submitted = false;
  constructor(private gameService: GameService, private authService: AuthenticationService, private router: Router) {
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
    } else if (authService.getCurrentUser().worldName !== '') {
      router.navigate(['/start']);
    }
  }

  ngOnInit(): void {
    this.gameService.listGames().subscribe(result => {
      console.log(result);
      this.gameInfo = result.availableGames;
    });
  }

  onJoin(worldName: string) {
    this.submitted = true;
    this.gameService.joinGame(this.authService.getCurrentUser().username, worldName).subscribe(result => {
      this.result = result.value;
      if (result.status === 'OK') {
        const player: PlayerInterface = {
          username: this.authService.getCurrentUser().username,
          password: this.authService.getCurrentUser().password,
          worldName: worldName,
          isAdmin: false,
          isPlaying: false
        };
        this.authService.updateLocalStorage(player);
        this.router.navigate(['/start']);
      }
    });
  }

  onCreate() {
    this.router.navigate(['/create']);
  }
}
