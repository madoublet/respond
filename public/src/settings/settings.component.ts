import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../shared/services/setting.service';

declare var toast: any;

@Component({
    selector: 'respond-settings',
    templateUrl: 'settings.component.html',
    providers: [SettingService]
})

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

    this.list();
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
      this._router.navigate( ['/login', this.id] );
    }

  }

}