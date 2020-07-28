import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { JoinComponent } from './join/join.component';
import {AuthenticationService} from './service/authentication.service';
import {GameService} from './service/game.service';
import { StartComponent, FormatTimePipe } from './start/start.component';
import { CreateComponent } from './create/create.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    JoinComponent,
    StartComponent,
    CreateComponent,
    FormatTimePipe,
    RegisterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule
    ],
  providers: [AuthenticationService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
