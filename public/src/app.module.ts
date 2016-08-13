import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { AppComponent }   from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { CreateComponent } from './create/create.component';
import { PagesComponent } from './pages/pages.component';
import { FilesComponent } from './files/files.component';
import { UsersComponent } from './users/users.component';
import { MenusComponent } from './menus/menus.component';
import { FormsComponent } from './forms/forms.component';
import { SettingsComponent } from './settings/settings.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { GalleriesComponent } from './galleries/galleries.component';
import { EditComponent } from './edit/edit.component';
import { HttpModule }     from '@angular/http';
import { AuthHttp, AuthConfig, tokenNotExpired, JwtHelper } from 'angular2-jwt/angular2-jwt';
import { routing } from './app.routes';
import { HTTP_PROVIDERS, Http} from '@angular/http';
import { TRANSLATE_PROVIDERS } from 'ng2-translate/ng2-translate';

@NgModule({
    declarations: [AppComponent, LoginComponent, ForgotComponent, ResetComponent, CreateComponent, PagesComponent, FilesComponent, UsersComponent, MenusComponent, FormsComponent, SettingsComponent, SubmissionsComponent, GalleriesComponent, EditComponent],
    imports:      [BrowserModule, FormsModule, RouterModule, routing, HttpModule],
    bootstrap:    [AppComponent],
    providers: [
        TRANSLATE_PROVIDERS,
        HTTP_PROVIDERS,
        {
          provide: AuthConfig,
          useValue: new AuthConfig({
            headerName: 'X-AUTH'
          })
        },
        {
            provide: AuthHttp,
            useFactory: (http) => {
                return new AuthHttp(new AuthConfig({
                    headerName: 'X-AUTH'
                }), http);
            },
            deps: [Http]
        }
    ]
})

export class AppModule {}