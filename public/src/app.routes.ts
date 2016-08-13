import { Routes, RouterModule } from '@angular/router';
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

const appRoutes: Routes = [
  {
    path: 'login/:id',
    component: LoginComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'forgot/:id',
    component: ForgotComponent
  },
  {
    path: 'reset/:id/:token',
    component: ResetComponent
  },
  {
    path: 'pages',
    component: PagesComponent
  },
  {
    path: 'files',
    component: FilesComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'menus',
    component: MenusComponent
  },
  {
    path: 'forms',
    component: FormsComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'submissions',
    component: SubmissionsComponent
  },
  {
    path: 'galleries',
    component: GalleriesComponent
  },
  {
    path: 'edit',
    component: EditComponent
  },
  {
    path: '',
    redirectTo: '/create',
    pathMatch: 'full'
  }
];

export const routing = RouterModule.forRoot(appRoutes);