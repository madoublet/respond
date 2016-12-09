import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';

declare var Dropzone: any;

@Component({
    selector: 'respond-dropzone',
    template: '<form class="dropzone"></form>'
})

export class DropzoneComponent {

  _url: string = '/api/images/add';
  dropzone: any;

  @Input()
  set url(url: string){
    this._url = url;
    this.updateDropzone();
  }

  get url() { return this._url; }

  @Output() onAdd = new EventEmitter<any>();

  constructor (private elementRef: ElementRef) {}

  /**
   * Init
   */
  ngOnInit() {

    this.setupDropzone();

  }

  setupDropzone() {

    var el = this.elementRef.nativeElement.querySelector('.dropzone');

    // set dropzone options
    var options = {
      url: this._url,
      headers: {}
    };

    // setup token headers
    options.headers = {};
    options.headers['X-AUTH'] = 'Bearer ' + localStorage.getItem('id_token');

    if(Dropzone != undefined) {

      // create the dropzone
      this.dropzone = new Dropzone(el, options);

      var context = this;

      this.dropzone.on("complete", function(file) {
        this.removeFile(file);
        context.onAdd.emit(null);
      });

    }

  }

  updateDropzone() {

    if (this.dropzone != undefined) {
      this.dropzone.options.url = this._url;
    }

  }

}