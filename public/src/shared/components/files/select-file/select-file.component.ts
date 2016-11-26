import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileService } from '../../../../shared/services/file.service';

declare var toast: any;

@Component({
    selector: 'respond-select-file',
    templateUrl: 'select-file.component.html',
    providers: [FileService]
})

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