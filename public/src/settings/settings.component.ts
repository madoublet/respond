import {Component} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {SettingService} from '/app/shared/services/setting.service';
import {DrawerComponent} from '/app/shared/components/drawer/drawer.component';
import {SelectFileComponent} from '/app/shared/components/files/select-file/select-file.component';

@Component({
    selector: 'respond-settings',
    templateUrl: './app/settings/settings.component.html',
    providers: [SettingService],
    directives: [SelectFileComponent, DrawerComponent],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class SettingsComponent {

  id;
  setting;
  settings;
  errorMessage;
  selectedSetting;
  drawerVisible: boolean;
  selectVisible: boolean;

  constructor (private _settingService: SettingService, private _router: Router) {}

  /**
   * Init
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.drawerVisible = false;
    this.selectVisible = false;
    this.settings;
    this.setting = null;

    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();

    this._settingService.list()
                     .subscribe(
                       data => { this.settings = data; },
                       error =>  { this.failure(<any>error); }
                      );

  }

  /**
   * Handles the form submission
   */
  submit() {

    this._settingService.edit(this.settings)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.failure(<any>error); }
                      );

  }


  /**
   * Shows the select modal
   */
  showSelect(setting) {
    this.setting = setting;
    this.selectVisible = true;
  }

  /**
   * Handles the selection of an image
   */
  select(event) {
    this.setting.value = 'files/' + event.name;
    this.selectVisible = false;
  }

  /**
   * Handles success
   */
  success() {
    toast.show('success');
  }

  /**
   * Resets screen
   */
  reset() {
    this.drawerVisible = false;
    this.selectVisible = false;
  }

  /**
   * Sets the setting to active
   *
   * @param {Setting} setting
   */
  setActive(setting) {
    this.selectedSetting = setting;

    this.listItems();
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * handles error
   */
  failure (obj) {

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['Login', {id: this.id}] );
    }

  }

}