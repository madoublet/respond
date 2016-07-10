import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CanActivate} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {tokenNotExpired} from 'angular2-jwt/angular2-jwt';
import {FileService} from '/app/shared/services/file.service';
import {DropzoneComponent} from '/app/shared/components/dropzone/dropzone.component';

@Component({
    selector: 'respond-select-file',
    templateUrl: './app/shared/components/files/select-file/select-file.component.html',
    providers: [FileService],
    directives: [DropzoneComponent],
    pipes: [TranslatePipe]
})

@CanActivate(() => tokenNotExpired())

export class SelectFileComponent {

  file;
  files;
  errorMessage;

  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _fileService: FileService) {}

  /**
   * Init files
   */
  ngOnInit() {

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
                       error =>  { this.onError.emit(<any>error); }
                      );
  }

  /**
   * Resets an modal booleans
   */
  reset() {
    this.file = {};
  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the form
   */
  select(file) {

    this.onSelect.emit(file);

  }


}