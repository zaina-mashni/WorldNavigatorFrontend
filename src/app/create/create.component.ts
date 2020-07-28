import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../service/game.service';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {PlayerInterface} from '../interface/player.interface';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;
  mapFileChosen: string;
  mapFiles: string[] = [];

  constructor(private formBuilder: FormBuilder, private gameService: GameService, private authService: AuthenticationService, private router: Router) {
    this.createForm = this.formBuilder.group({
      worldName: ['', [Validators.required]],
      mapFile: ['', [Validators.required]],
    });
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.gameService.listMapFiles().subscribe(result => {
      console.log(result);
      this.mapFiles = result.mapFiles;
    });
  }

  onCreate(worldName: string) {
    if (this.createForm.invalid) {
      return;
    }
    console.log(this.mapFileChosen);
    this.gameService.createGame(this.authService.getCurrentUser().username, worldName, this.mapFileChosen).subscribe(result => {
      console.log(result);
      const player: PlayerInterface = {
        username: this.authService.getCurrentUser().username,
        password: this.authService.getCurrentUser().password,
        worldName: worldName,
        isAdmin: true
      };
      this.authService.updateLocalStorage(player);
      this.router.navigate(['/start']);
    });
  }
}
