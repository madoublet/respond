import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';

// app component
import { AppComponent }   from './app.component';

// common
import { DrawerComponent } from './shared/components/drawer/drawer.component';
import { DropzoneComponent } from './shared/components/dropzone/dropzone.component';

// logon, forgot, reset, create
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { CreateComponent } from './create/create.component';

// developer + code
import { DeveloperComponent } from './developer/developer.component';
import { CodeComponent } from './code/code.component';
import { AddCodeComponent } from './shared/components/code/add-code/add-code.component';

// edit
import { EditComponent } from './edit/edit.component';

// files
import { FilesComponent } from './files/files.component';
import { RemoveFileComponent } from './shared/components/files/remove-file/remove-file.component';
import { SelectFileComponent } from './shared/components/files/select-file/select-file.component';

// plugins
import { PluginsComponent } from './plugins/plugins.component';
import { RemovePluginComponent } from './shared/components/plugins/remove-plugin/remove-plugin.component';

// forms
import { FormsComponent } from './forms/forms.component';
import { AddFormComponent } from './shared/components/forms/add-form/add-form.component';
import { EditFormComponent } from './shared/components/forms/edit-form/edit-form.component';
import { RemoveFormComponent } from './shared/components/forms/remove-form/remove-form.component';
import { AddFormFieldComponent } from './shared/components/forms/add-form-field/add-form-field.component';
import { EditFormFieldComponent } from './shared/components/forms/edit-form-field/edit-form-field.component';
import { RemoveFormFieldComponent } from './shared/components/forms/remove-form-field/remove-form-field.component';

// galleries
import { GalleriesComponent } from './galleries/galleries.component';
import { AddGalleryComponent } from './shared/components/galleries/add-gallery/add-gallery.component';
import { EditGalleryComponent } from './shared/components/galleries/edit-gallery/edit-gallery.component';
import { RemoveGalleryComponent } from './shared/components/galleries/remove-gallery/remove-gallery.component';
import { EditCaptionComponent } from './shared/components/galleries/edit-caption/edit-caption.component';
import { RemoveGalleryImageComponent } from './shared/components/galleries/remove-gallery-image/remove-gallery-image.component';

// menus
import { MenusComponent } from './menus/menus.component';
import { AddMenuComponent } from './shared/components/menus/add-menu/add-menu.component';
import { EditMenuComponent } from './shared/components/menus/edit-menu/edit-menu.component';
import { RemoveMenuComponent } from './shared/components/menus/remove-menu/remove-menu.component';
import { AddMenuItemComponent } from './shared/components/menus/add-menu-item/add-menu-item.component';
import { EditMenuItemComponent } from './shared/components/menus/edit-menu-item/edit-menu-item.component';
import { RemoveMenuItemComponent } from './shared/components/menus/remove-menu-item/remove-menu-item.component';

// pages
import { PagesComponent } from './pages/pages.component';
import { AddPageComponent } from './shared/components/pages/add-page/add-page.component';
import { PageSettingsComponent } from './shared/components/pages/page-settings/page-settings.component';
import { RemovePageComponent } from './shared/components/pages/remove-page/remove-page.component';

// component
import { ComponentsComponent } from './components/components.component';
import { AddComponentComponent } from './shared/components/components/add-component/add-component.component';
import { RemoveComponentComponent } from './shared/components/components/remove-component/remove-component.component';

// settings
import { SettingsComponent } from './settings/settings.component';

// submissions
import { SubmissionsComponent } from './submissions/submissions.component';
import { RemoveSubmissionComponent } from './shared/components/submissions/remove-submission/remove-submission.component';
import { ViewSubmissionComponent } from './shared/components/submissions/view-submission/view-submission.component';

// users
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './shared/components/users/add-user/add-user.component';
import { EditUserComponent } from './shared/components/users/edit-user/edit-user.component';
import { RemoveUserComponent } from './shared/components/users/remove-user/remove-user.component';

// http, routing, translate
import { HttpModule }     from '@angular/http';
import { routing } from './app.routes';
import { TranslateModule } from 'ng2-translate';

// pipes
import { TimeAgoPipe } from './shared/pipes/time-ago.pipe';

@NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      ForgotComponent,
      ResetComponent,
      CreateComponent,
      DrawerComponent, DropzoneComponent,
      EditComponent, DeveloperComponent, CodeComponent, AddCodeComponent,
      FilesComponent, RemoveFileComponent, SelectFileComponent, PluginsComponent, RemovePluginComponent,
      FormsComponent, AddFormComponent, EditFormComponent, RemoveFormComponent, AddFormFieldComponent, EditFormFieldComponent, RemoveFormFieldComponent,
      GalleriesComponent, AddGalleryComponent, EditGalleryComponent, RemoveGalleryComponent, EditCaptionComponent, RemoveGalleryImageComponent,
      MenusComponent, AddMenuComponent, EditMenuComponent, RemoveMenuComponent, AddMenuItemComponent, EditMenuItemComponent, RemoveMenuItemComponent,
      PagesComponent, AddPageComponent, PageSettingsComponent, RemovePageComponent,
      ComponentsComponent, AddComponentComponent, RemoveComponentComponent,
      SettingsComponent,
      SubmissionsComponent, RemoveSubmissionComponent, ViewSubmissionComponent,
      UsersComponent, AddUserComponent, EditUserComponent, RemoveUserComponent,
      TimeAgoPipe],
    imports:      [BrowserModule, FormsModule, RouterModule, routing, HttpModule, TranslateModule.forRoot()],
    bootstrap:    [AppComponent],
    providers: []
})

export class AppModule {}