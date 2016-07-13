import {Component} from '@angular/core';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, CanActivate} from '@angular/router-deprecated';
import {FileService} from '../shared/services/file.service';
import {RemoveFileComponent} from '../shared/components/files/remove-file/remove-file.component';
import {DropzoneComponent} from '../shared/components/dropzone/dropzone.component';
import {DrawerComponent} from '../shared/components/drawer/drawer.component';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'respond-files',
    moduleId: __moduleName,
    templateUrl: '/app/files/files.component.html',
    providers: [FileService],
    directives: [RemoveFileComponent, DropzoneComponent, DrawerComponent],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class FilesComponent {

  id;
  file;
  files;
  errorMessage;
  selectedFile;
  removeVisible: boolean;
  drawerVisible: boolean;


  constructor (private _fileService: FileService, private _router: Router) {}

  /**
   * Init files
   *
   */
  ngOnInit() {

    this.id = localStorage.getItem('respond.siteId');
    this.removeVisible = false;
    this.drawerVisible = false;
    this.file = {};
    this.files = [];

    // list files
    this.list();

  }

  /**
   * Updates the list
   */
  list() {

    this.reset();
    this._fileService.list()
                     .subscribe(
                       data => { this.files = data; },
                       error =>  { this.failure(<any>error); }
                      );
  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.removeVisible = false;
    this.drawerVisible = false;
    this.file = {};
  }

  /**
   * Sets the list item to active
   *
   * @param {File} file
   */
  setActive(file) {
    this.selectedFile = file;
  }

  /**
   * Shows the drawer
   */
  toggleDrawer() {
    this.drawerVisible = !this.drawerVisible;
  }

  /**
   * Shows the remove dialog
   *
   * @param {File} file
   */
  showRemove(file) {
    this.removeVisible = true;
    this.file = file;
  }

  /**
   * handles error
   */
  failure(obj) {

    toast.show('failure');

    if(obj.status == 401) {
      this._router.navigate( ['Login', {id: this.id}] );
    }

  }

}