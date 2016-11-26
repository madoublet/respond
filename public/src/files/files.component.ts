import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../shared/services/file.service';

declare var toast: any;

@Component({
    selector: 'respond-files',
    templateUrl: 'files.component.html',
    providers: [FileService]
})


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
      this._router.navigate( ['/login', this.id] );
    }

  }

}