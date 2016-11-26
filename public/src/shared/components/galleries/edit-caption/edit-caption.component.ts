import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleryImageService } from '../../../../shared/services/gallery-image.service';

declare var toast: any;

@Component({
    selector: 'respond-edit-caption',
    templateUrl: 'edit-caption.component.html',
    providers: [GalleryImageService]
})

export class EditCaptionComponent {

  // model to store
  model = {
    id: '',
    caption: ''
  };

  // visible input
  _visible: boolean = false;

  @Input()
  set visible(visible: boolean){

    // set visible
    this._visible = visible;

  }

  get visible() { return this._visible; }

  // index
  @Input() index;

  // item input
  @Input()
  set image(image){

    // set item
    this.model = image;

  }

  // gallery input
  @Input() gallery;

  // outputs
  @Output() onCancel = new EventEmitter<any>();
  @Output() onAdd = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();

  constructor (private _galleryImageService: GalleryImageService) {}

  /**
   * Init
   */
  ngOnInit() {

    this.model = {
      id: '',
      caption: ''
    };

  }

  /**
   * Hides the add modal
   */
  hide() {
    this._visible = false;
    this.onCancel.emit(null);
  }

  /**
   * Submits the gallery image
   */
  submit() {

    this._galleryImageService.edit(this.model.id, this.model.caption, this.gallery.id)
                     .subscribe(
                       data => { this.success(); },
                       error =>  { this.onError.emit(<any>error); }
                      );

  }

  /**
   * Handles a successful add
   */
  success() {

    toast.show('success');

    this._visible = false;
    this.onAdd.emit(null);

  }

}