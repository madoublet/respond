import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleryImageService } from '../../../../shared/services/gallery-image.service';

declare var toast: any;

@Component({
    selector: 'respond-remove-gallery-image',
    templateUrl: 'remove-gallery-image.component.html',
    providers: [GalleryImageService]
})

export class RemoveGalleryImageComponent {

  routes;

  // model to store
  model;

  _visible: boolean = false;

  // visible input
  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  // image input
  @Input()
  set image(image){

    // set visible
    this.model = image;

  }

  // gallery input
  @Input() gallery;

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _galleryImageService: GalleryImageService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      id: '',
      name: '',
      url: '',
      caption: ''
    };

  }

  /**
   * Hides the modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the gallery image
   */
  submit() {

    this._galleryImageService.remove(this.model.id, this.gallery.id)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful submission
   */
  success() {

    this._visible = false;
    this.onUpdate.emit(null);

  }


}