import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {TRANSLATE_PROVIDERS, TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {LoginComponent} from './login/login.component';
import {ForgotComponent} from './forgot/forgot.component';
import {ResetComponent} from './reset/reset.component';
import {CreateComponent} from './create/create.component';
import {PagesComponent} from './pages/pages.component';
import {FilesComponent} from './files/files.component';
import {UsersComponent} from './users/users.component';
import {MenusComponent} from './menus/menus.component';
import {FormsComponent} from './forms/forms.component';
import {SettingsComponent} from './settings/settings.component';
import {SubmissionsComponent} from './submissions/submissions.component';
import {GalleriesComponent} from './galleries/galleries.component';
import {EditComponent} from './edit/edit.component';

@Component({
    selector: 'respond-app',
    directives: [ROUTER_DIRECTIVES],
    providers: [
      ROUTER_PROVIDERS
    ],
    templateUrl: './app/app.component.html'
})

@RouteConfig([
  {
    path: '/create',
    name: 'Create',
    component: CreateComponent,
    useAsDefault: true
  },
  {
    path: '/login/:id',
    name: 'Login',
    component: LoginComponent
  },
  {
    path: '/forgot/:id',
    name: 'Forgot',
    component: ForgotComponent
  },
  {
    path: '/reset/:id/:token',
    name: 'Reset',
    component: ResetComponent
  },
  {
    path: '/pages',
    name: 'Pages',
    component: PagesComponent
  },
  {
    path: '/files',
    name: 'Files',
    component: FilesComponent
  },
  {
    path: '/users',
    name: 'Users',
    component: UsersComponent
  },
  {
    path: '/menus',
    name: 'Menus',
    component: MenusComponent
  },
  {
    path: '/forms',
    name: 'Forms',
    component: FormsComponent
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsComponent
  },
  {
    path: '/submissions',
    name: 'Submissions',
    component: SubmissionsComponent
  },
  {
    path: '/galleries',
    name: 'Galleries',
    component: GalleriesComponent
  },
  {
    path: '/edit',
    name: 'Edit',
    component: EditComponent
  }
])

export class AppComponent {
  
  constructor(private _translate: TranslateService) {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(fr|en)/gi.test(userLang) ? userLang : 'en';

         // this language will be used as a fallback when a translation isn't found in the current language
        _translate.setDefaultLang('en');
        
         // the lang to use, if the lang isn't available, it will use the current loader to get them
        _translate.use(userLang);
    }
  
}